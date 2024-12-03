import type { Session } from '@types';

import { AppTokens } from '@app/app.tokens';
import { ConfigService } from '@config/config.service';
import {
	PublicUser,
	UserInsert,
	UserRole,
	UserSelect,
	UserUpdate,
} from '@database/users/users.schema';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';
import {
	InsufficientPermissionsException,
	UserConflictException,
	UserIdNotFoundException,
	UserUsernameNotFoundException,
} from '@users/users.exceptions';
import { UserRepository } from '@users/users.repository';

@Injectable()
export class UsersService implements OnModuleInit {
	private readonly logger = new Logger(UsersService.name);

	constructor(
		@Inject(AppTokens.USER_REPOSITORY)
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
	) {}

	/**
	 * Initializes the service.
	 */
	async onModuleInit(): Promise<void> {
		await this.ensureAdminUserExists();
	}

	/**
	 * Ensures that the super admin user exists in the system.
	 * If the user does not exist, it is created using the provided environment variables.
	 */
	private async ensureAdminUserExists(): Promise<void> {
		const adminUsername = this.configService.getStrictEnv(
			'SUPER_ADMIN_USERNAME',
		);
		const adminPassword = this.configService.getStrictEnv(
			'SUPER_ADMIN_PASSWORD',
		);

		const temporalSession: Session = {
			id: '',
			role: UserRole.ADMIN,
			username: adminUsername,
			iat: 0,
			exp: 0,
		};

		const adminUser =
			await this.userRepository.findByUsername(adminUsername);

		if (!adminUser) {
			await this.createUser(
				{
					username: adminUsername,
					password: adminPassword,
					role: UserRole.ADMIN,
				},
				temporalSession,
			);
			this.logger.log(
				`Created super admin user with username '${adminUsername}'`,
			);
		}
	}

	/**
	 * Retrieves a user by their ID.
	 *
	 * @param id - The ID of the user to retrieve.
	 * @returns A promise that resolves to the selected user.
	 * @throws If no user is found with the given ID.
	 */
	async getUserById(id: string): Promise<UserSelect> {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new UserIdNotFoundException();
		}

		return user;
	}

	/**
	 * Retrieves a user by their username.
	 *
	 * @param username - The username of the user to retrieve.
	 * @returns A promise that resolves to the user data.
	 * @throws If no user is found with the given username.
	 */
	async getUserByUsername(username: string): Promise<UserSelect> {
		const user = await this.userRepository.findByUsername(username);

		if (!user) {
			throw new UserUsernameNotFoundException();
		}

		return user;
	}

	/**
	 * Creates a new user in the system.
	 *
	 * This method first checks if there is an existing user that conflicts with the provided user data.
	 * If a conflict is found, a `UserConflictException` is thrown.
	 * Otherwise, the user is created and the password is excluded from the returned public user data.
	 *
	 * @param user - The user data to insert.
	 * @returns A promise that resolves to the public user data without the password.
	 * @throws UserConflictException - If a user with conflicting data already exists.
	 */
	async createUser(user: UserInsert, session: Session): Promise<PublicUser> {
		if (!this.hasPermissions(undefined, session)) {
			throw new InsufficientPermissionsException();
		}

		this.logger.log(`User session: ${JSON.stringify(session)}`);

		const existingUser = await this.getUserInConflict(user);

		if (existingUser) {
			throw new UserConflictException();
		}

		user.password = await this.hashPassword(user.password);

		const { password, ...publicUser } =
			await this.userRepository.createUser(user);

		return publicUser;
	}

	/**
	 * Updates a user with the provided information.
	 *
	 * @param user - The user information to update.
	 * @returns A promise that resolves to the updated public user information.
	 * @throws If the user to update is not found or the user does not have the necessary permissions.
	 */
	async updateUser(user: UserUpdate, session: Session): Promise<PublicUser> {
		if (!this.hasPermissions(user.id, session)) {
			throw new InsufficientPermissionsException();
		}

		if (user.password) {
			user.password = await this.hashPassword(user.password);
		}

		const updatedUser = await this.userRepository.updateUser(user);

		if (!updatedUser) {
			throw new UserIdNotFoundException();
		}

		const { password, ...publicUser } = updatedUser;

		return publicUser;
	}

	/**
	 * Deletes a user by their ID.
	 *
	 * @param id - The ID of the user to delete.
	 * @returns A promise that resolves to the public user data of the deleted user.
	 * @throws If the user with the specified ID is not found or the user does not have the necessary permissions.
	 */
	async deleteUser(id: string, session: Session): Promise<PublicUser> {
		if (!this.hasPermissions(id, session)) {
			throw new InsufficientPermissionsException();
		}

		const deletedUser = await this.userRepository.deleteUser(id);

		if (!deletedUser) {
			throw new UserIdNotFoundException();
		}

		const { password, ...publicUser } = deletedUser;

		return publicUser;
	}

	/**
	 * Retrieves a user that is in conflict based on the provided user data.
	 *
	 * @param user - The user data to check for conflicts. Can be of type UserInsert or UserUpdate.
	 * @returns A promise that resolves to the conflicting user data of type UserSelect, or null if no conflict is found.
	 */
	private async getUserInConflict(
		user: UserInsert | UserUpdate,
	): Promise<UserSelect | null> {
		if (!user.username) {
			return null;
		}

		const existingUser = await this.userRepository.findByUsername(
			user.username,
		);

		return existingUser;
	}

	/**
	 * Checks if the user has the necessary permissions based on their session.
	 *
	 * @param userId - The ID of the user to check permissions for.
	 * @param session - The session object containing user information.
	 *
	 * @returns `true` if the user has permissions, `false` otherwise.
	 */
	private hasPermissions(
		userId: string | undefined,
		session: Session,
	): boolean {
		return (
			session.role === UserRole.ADMIN ||
			(userId !== undefined && session.id === userId)
		);
	}

	/**
	 * Hashes the provided password using Argon2.
	 *
	 * @param password - The password to hash.
	 *
	 * @returns A promise that resolves to the hashed password.
	 */
	async hashPassword(password: string): Promise<string> {
		return await hash(password);
	}

	/**
	 * Verifies the provided password against the provided hash.
	 *
	 * @param password - The password to verify.
	 * @param hash - The hash to verify against.
	 *
	 * @returns A promise that resolves to `true` if the password is verified, `false` otherwise.
	 */
	async verifyPassword(password: string, hash: string): Promise<boolean> {
		return await verify(hash, password);
	}
}

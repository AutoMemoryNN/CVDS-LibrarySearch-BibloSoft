import type { Session } from '@types';

import { AppTokens } from '@app/app.tokens';
import {
	PublicUser,
	UserInsert,
	UserRole,
	UserSelect,
	UserUpdate,
} from '@database/users/users.schema';
import { Inject, Injectable } from '@nestjs/common';
import {
	InsufficientPermissionsException,
	UserConflictException,
	UserIdNotFoundException,
	UserUsernameNotFoundException,
} from '@users/users.exceptions';
import { UserRepository } from '@users/users.repository';

@Injectable()
export class UsersService {
	constructor(
		@Inject(AppTokens.USER_REPOSITORY)
		private readonly userRepository: UserRepository,
	) {}

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
	async createUser(user: UserInsert): Promise<PublicUser> {
		const existingUser = await this.getUserInConflict(user);

		if (existingUser) {
			throw new UserConflictException();
		}

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
	 * @returns `true` if the user has permissions, `false` otherwise.
	 */
	private hasPermissions(userId: string, session: Session): boolean {
		if (!session) {
			return false;
		}

		return session.id === userId || session.role === UserRole.ADMIN;
	}
}

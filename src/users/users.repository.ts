import type { UsersDatabase } from '@types';

import { AppTokens } from '@app/app.tokens';
import {
	UserInsert,
	UserSchema,
	UserSelect,
	UserUpdate,
} from '@database/users/users.schema';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

/**
 * Interface representing a repository for managing user data.
 */
export interface UserRepository {
	/**
	 * Finds a user by their unique identifier.
	 * @param id - The unique identifier of the user.
	 * @returns A promise that resolves to the selected user data or null if no user is found.
	 */
	findById(id: string): Promise<UserSelect | null>;

	/**
	 * Finds a user by their username.
	 * @param username - The username of the user.
	 * @returns A promise that resolves to the selected user data or null if no user is found.
	 */
	findByUsername(username: string): Promise<UserSelect | null>;

	/**
	 * Creates a new user.
	 * @param user - The user data to insert.
	 * @returns A promise that resolves to the selected user data.
	 */
	createUser(user: UserInsert): Promise<UserSelect>;

	/**
	 * Updates an existing user.
	 * @param id - The unique identifier of the user to update.
	 * @param user - The user data to update.
	 * @returns A promise that resolves to the selected user data or null if no user is found.
	 */
	updateUser(user: UserUpdate): Promise<UserSelect | null>;

	/**
	 * Deletes a user.
	 * @param id - The unique identifier of the user to delete.
	 * @returns A promise that resolves to the selected user data or null if no user is found.
	 */
	deleteUser(id: string): Promise<UserSelect | null>;
}

/**
 * Repository for managing user data using the PostgreSQL database.
 */
@Injectable()
export class UserPostgresRepository implements UserRepository {
	constructor(
		@Inject(AppTokens.USERS_DATABASE)
		private readonly database: UsersDatabase,
	) {}

	async findById(id: string): Promise<UserSelect | null> {
		const [user] = await this.database
			.select()
			.from(UserSchema.usersTable)
			.where(eq(UserSchema.usersTable.id, id));

		if (!user) {
			return null;
		}

		return user;
	}

	async findByUsername(username: string): Promise<UserSelect | null> {
		const [user] = await this.database
			.select()
			.from(UserSchema.usersTable)
			.where(eq(UserSchema.usersTable.username, username));

		if (!user) {
			return null;
		}

		return user;
	}

	async createUser(user: UserInsert): Promise<UserSelect> {
		const [insertedUser] = await this.database
			.insert(UserSchema.usersTable)
			.values(user)
			.returning();

		return insertedUser;
	}

	async updateUser(user: UserUpdate): Promise<UserSelect | null> {
		const [updatedUser] = await this.database
			.update(UserSchema.usersTable)
			.set(user)
			.where(eq(UserSchema.usersTable.id, user.id))
			.returning();

		if (!updatedUser) {
			return null;
		}

		return updatedUser;
	}

	async deleteUser(id: string): Promise<UserSelect | null> {
		const [deletedUser] = await this.database
			.delete(UserSchema.usersTable)
			.where(eq(UserSchema.usersTable.id, id))
			.returning();

		if (!deletedUser) {
			return null;
		}

		return deletedUser;
	}
}

/**
 * Repository for managing user data using an in-memory array.
 */
export class UserMemoryRepository implements UserRepository {
	users: UserSelect[] = [];

	async findById(id: string): Promise<UserSelect | null> {
		return this.users.find((user) => user.id === id) || null;
	}

	async findByUsername(username: string): Promise<UserSelect | null> {
		return this.users.find((user) => user.username === username) || null;
	}

	async createUser(user: UserInsert): Promise<UserSelect> {
		const newUser: UserSelect = {
			...user,
			id: String(this.users.length + 1),
		};

		this.users.push(newUser);

		return await Promise.resolve(newUser);
	}

	async updateUser(user: UserUpdate): Promise<UserSelect | null> {
		const index = this.users.findIndex((target) => target.id === user.id);

		if (index === -1) {
			return null;
		}

		const updatedUser = { ...this.users[index], ...user };
		this.users[index] = updatedUser;

		return await Promise.resolve(updatedUser);
	}

	async deleteUser(id: string): Promise<UserSelect | null> {
		const index = this.users.findIndex((user) => user.id === id);

		if (index === -1) {
			return null;
		}

		const deletedUser = this.users[index];
		this.users.splice(index, 1);

		return await Promise.resolve(deletedUser);
	}
}

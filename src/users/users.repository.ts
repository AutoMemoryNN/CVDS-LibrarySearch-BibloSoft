import type { UsersDatabase } from '@types';

import { AppTokens } from '@app/app.tokens';
import { UserSchema, UserSelect } from '@database/users/users.schema';
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
}

/**
 * Repository for managing user data using the Drizzle ORM.
 */
@Injectable()
export class UserDrizzleRepository implements UserRepository {
	constructor(
		@Inject(AppTokens.USERS_DATABASE)
		private readonly database: UsersDatabase,
	) {}

	async findById(id: string): Promise<UserSelect | null> {
		const [user] = await this.database
			.select()
			.from(UserSchema.studentsTable)
			.where(eq(UserSchema.studentsTable.id, Number(id))); //TODO: Change to string when database fix it

		if (!user) {
			return null;
		}

		return user;
	}

	async findByUsername(username: string): Promise<UserSelect | null> {
		const [user] = await this.database
			.select()
			.from(UserSchema.studentsTable)
			.where(eq(UserSchema.studentsTable.username, username));

		if (!user) {
			return null;
		}

		return user;
	}
}

export class UserDemoRepository implements UserRepository {
	users: UserSelect[] = [
		{
			id: 1,
			idType: 'CC',
			idNumber: '123456789',
			username: 'demo',
			password: 'demo',
			name: 'Demo User',
			courseId: 1,
			responsibleDocument: '123456789',
		},
		{
			id: 2,
			idType: 'CC',
			idNumber: '987654321',
			username: 'admin',
			password: 'admin',
			name: 'Admin User',
			courseId: 1,
			responsibleDocument: '987654321',
		},
	];

	async findById(id: string): Promise<UserSelect | null> {
		return this.users.find((user) => user.id === Number(id)) || null;
	}

	async findByUsername(username: string): Promise<UserSelect | null> {
		return this.users.find((user) => user.username === username) || null;
	}
}

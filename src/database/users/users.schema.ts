import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

/**
 * Represents the possible roles that a user can have.
 */
export enum UserRole {
	STUDENT = 'student',
	ADMIN = 'admin',
}

/**
 * Represents the enum type for the 'user_role' column in the users table.
 */
const userRoleEnum = pgEnum(
	'user_role',
	Object.values(UserRole) as [string, ...string[]],
);

/**
 * Represents the schema for the 'users' table in the database.
 **/
const usersTable = pgTable('users', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	username: text('username').unique().notNull(),
	password: text('password').notNull(),
	role: userRoleEnum('role').$type<UserRole>().notNull(),
});

/**
 *
 * Represents the schema for the entire users database.
 */
export const UserSchema = {
	usersTable,
} as const;

/**
 * Represents the type for selecting user data from the users table.
 * This type is inferred from the schema definition of the users table.
 */
export type UserSelect = typeof UserSchema.usersTable.$inferSelect;

/**
 * Represents the type for selecting public user data from the users table.
 * This type is inferred from the schema definition of the users table.
 */
export type PublicUser = Omit<UserSelect, 'password'>;

/**
 * Represents the type for updating user data in the users table.
 * This type is inferred from the schema definition of the users table.
 */
export type UserUpdate = Pick<UserSelect, 'id'> &
	Omit<Partial<UserInsert>, 'id'>;

/**
 * Represents the type for inserting user data into the users table.
 * This type is inferred from the schema definition of the users table.
 */
export type UserInsert = typeof UserSchema.usersTable.$inferInsert;

/**
 * Exports used by drizzle-kit to generate the database schema.
 */
export { usersTable, userRoleEnum };

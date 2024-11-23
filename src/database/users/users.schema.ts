import { pgTable, text } from 'drizzle-orm/pg-core';

/**
 * Represents the schema for the 'users' table in the database.
 **/
const usersTable = pgTable('users', {
	id: text('id').primaryKey().notNull(),
	username: text('username').unique().notNull(),
	password: text('password').notNull(),
	role: text('role').notNull(), //TODO: Change to an enum
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

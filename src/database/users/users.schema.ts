import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

/**
 * Represents the schema for the 'students' table in the database.
 **/
const studentsTable = pgTable('students', {
	id: integer('id').primaryKey().notNull(),
	idType: varchar('documenttype', { length: 20 }).notNull(),
	idNumber: varchar('document', { length: 50 }).notNull(),
	username: varchar('username', { length: 50 }).notNull(),
	password: varchar('password', { length: 50 }).notNull(),
	name: varchar('name', { length: 100 }).notNull(),
	responsibleDocument: varchar('responsibledocument', {
		length: 50,
	}).notNull(),
	courseId: integer('course').notNull(),
});

/**
 *
 * Represents the schema for the entire users database.
 */
export const UserSchema = {
	studentsTable,
} as const;

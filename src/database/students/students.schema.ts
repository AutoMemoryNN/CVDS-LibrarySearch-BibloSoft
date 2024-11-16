import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

/**
 * Represents the schema for the 'students' table in the database.
 **/
const studentsTable = pgTable('students', {
	id: integer('code').primaryKey().notNull(),
	idType: varchar('identification_type', { length: 20 }).notNull(),
	idNumber: varchar('identification_number', { length: 50 }).notNull(),
	username: varchar('userName', { length: 50 }).notNull(),
	password: varchar('password', { length: 50 }).notNull(),
	name: varchar('name', { length: 100 }).notNull(),
	academicYear: integer('academicYear').notNull(),
	relationWithResponsible: varchar('relationWithResponsible', {
		length: 50,
	}).notNull(),
	idResponsible: varchar('idResponsible', { length: 50 }).notNull(),
	courseId: integer('courseId').notNull(),
});

/**
 * Represents the schema for the entire students database.
 */
export const StudentSchema = {
	studentsTable,
} as const;

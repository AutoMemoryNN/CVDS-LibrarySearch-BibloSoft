import type { DrizzlePostgresConfig } from '@knaadh/nestjs-drizzle-postgres';

import { StudentSchema } from '@database/students/students.schema';

/**
 * Class representing the students database configuration.
 */
export class StudentDatabaseConfig {
	create(): DrizzlePostgresConfig {
		return {
			postgres: {
				url: process.env.STUDENTS_DATABASE_URL || '',
			},
			config: { schema: { ...StudentSchema } },
		};
	}
}

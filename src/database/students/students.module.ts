import { AppConfig } from '@app/app.config';
import { StudentDatabaseConfig } from '@database/students/students.config';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		DrizzlePostgresModule.registerAsync({
			tag: AppConfig.tokens.STUDENTS_DATABASE,
			useClass: StudentDatabaseConfig,
		}),
	],
	exports: [DrizzlePostgresModule],
})
export class StudentDatabaseModule {}

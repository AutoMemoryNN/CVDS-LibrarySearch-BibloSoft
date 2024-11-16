import { AuthModule } from '@auth/auth.module';
import { StudentDatabaseModule } from '@database/students/students.module';
import { HealthModule } from '@health/health.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [AuthModule, StudentDatabaseModule, HealthModule],
})
export class AppModule {}

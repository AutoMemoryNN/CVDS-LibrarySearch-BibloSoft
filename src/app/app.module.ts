import { AuthModule } from '@auth/auth.module';
import { ConfigModule } from '@config/config.module';
import { UserDatabaseModule } from '@database/users/users.module';
import { HealthModule } from '@health/health.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [AuthModule, ConfigModule, UserDatabaseModule, HealthModule],
})
export class AppModule {}

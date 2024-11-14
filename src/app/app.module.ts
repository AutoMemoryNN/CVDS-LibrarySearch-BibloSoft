import { AuthModule } from '@auth/auth.module';
import { HealthModule } from '@health/health.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [AuthModule, HealthModule],
})
export class AppModule {}

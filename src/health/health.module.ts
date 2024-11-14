import { HealthController } from '@health/health.controller';
import { Module } from '@nestjs/common';

@Module({
	controllers: [HealthController],
})
export class HealthModule {}

import { AppTokens } from '@app/app.tokens';
import { Module } from '@nestjs/common';
import { MemorySessionManager } from '@sessions/sessions.repository';
import { SessionManagerService } from '@sessions/sessions.service';

@Module({
	providers: [
		SessionManagerService,
		{
			provide: AppTokens.SESSIONS_REPOSITORY,
			useClass: MemorySessionManager,
		},
	],
	exports: [SessionManagerService],
})
export class SessionsModule {}

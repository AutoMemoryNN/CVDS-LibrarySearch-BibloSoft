import { AppTokens } from '@app/app.tokens';
import { Module } from '@nestjs/common';
import { SessionManagerService } from '@sessions/sessions.service';
import { MemorySessionManager } from './sessions.repository';

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

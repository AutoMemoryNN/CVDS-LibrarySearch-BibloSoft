import { AppTokens } from '@app/app.tokens';
import { Module } from '@nestjs/common';
import { UserDemoRepository } from '@users/users.repository';
import { UsersService } from '@users/users.service';

@Module({
	providers: [
		UsersService,
		{
			provide: AppTokens.USER_REPOSITORY,
			useClass: UserDemoRepository,
		},
	],
	exports: [UsersService],
})
export class UsersModule {}

import { AppTokens } from '@app/app.tokens';
import { Module } from '@nestjs/common';
import { UsersController } from '@users/users.controller';
import { UserMemoryRepository } from '@users/users.repository';
import { UsersService } from '@users/users.service';

@Module({
	providers: [
		UsersService,
		{
			provide: AppTokens.USER_REPOSITORY,
			useClass: UserMemoryRepository,
		},
	],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}

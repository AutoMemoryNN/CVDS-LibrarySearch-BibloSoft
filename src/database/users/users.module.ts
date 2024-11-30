import { AppTokens } from '@app/app.tokens';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { UserDatabaseConfig } from '@database/users/users.config';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		DrizzlePostgresModule.registerAsync({
			tag: AppTokens.USERS_DATABASE,
			imports: [ConfigModule],
			inject: [ConfigService],
			useClass: UserDatabaseConfig,
		}),
	],
	exports: [DrizzlePostgresModule],
})
export class UserDatabaseModule {}

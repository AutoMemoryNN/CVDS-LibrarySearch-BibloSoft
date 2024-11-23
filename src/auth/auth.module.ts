import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UsersModule } from '@users/users.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService): JwtModuleOptions => ({
				...configService.getJwtOptions(),
			}),
		}),
		UsersModule,
		SessionsModule,
	],
	exports: [AuthService],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}

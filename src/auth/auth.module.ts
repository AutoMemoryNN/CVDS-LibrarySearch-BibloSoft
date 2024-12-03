import { AuthController } from '@auth/auth.controller';
import { AuthMiddleware } from '@auth/auth.middleware';
import { AuthService } from '@auth/auth.service';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { SessionsModule } from '@sessions/sessions.module';
import { UsersModule } from '@users/users.module';

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
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AuthMiddleware).forRoutes('users');
	}
}

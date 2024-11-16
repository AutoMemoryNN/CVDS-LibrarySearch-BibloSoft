import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService): JwtModuleOptions => ({
				...configService.getJwtOptions(),
			}),
		}),
	],
	exports: [AuthService],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}

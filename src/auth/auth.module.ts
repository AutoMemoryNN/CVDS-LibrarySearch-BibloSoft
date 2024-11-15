import { AppConfig } from '@app/app.config';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [JwtModule.register(AppConfig.jwt)],
	exports: [JwtModule, AuthService],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}

import type { ControllerResponse, Session } from '@types';

import { Token } from '@auth/auth.decorators';
import { LoginDto, LoginValidationPipe } from '@auth/auth.dto';
import { AuthService } from '@auth/auth.service';
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('session')
	getSession(@Token() token: string): ControllerResponse<Session> {
		const session = this.authService.decodeSession(token);

		return { data: session };
	}

	@Post('login')
	async loginUser(
		@Body(LoginValidationPipe) credentials: LoginDto,
	): Promise<ControllerResponse<string>> {
		const token = await this.authService.loginUser(credentials);

		return { data: token };
	}

	@Patch('session')
	refreshToken(@Token() token: string): ControllerResponse<string> {
		const newToken = this.authService.refreshToken(token);

		return { data: newToken };
	}

	@Delete('session')
	logoutUser(@Token() token: string): ControllerResponse<null> {
		this.authService.logoutUser(token);

		return { message: 'User logged out successfully.' };
	}
}

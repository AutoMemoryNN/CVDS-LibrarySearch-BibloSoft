import type { ControllerResponse, Session } from '@types';

import { Token } from '@auth/auth.decorators';
import { LoginDto, LoginValidationPipe } from '@auth/auth.dto';
import { AuthService } from '@auth/auth.service';
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiHeader,
	ApiOperation,
	ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('session')
	@ApiOperation({ summary: 'Get the current session' })
	@ApiHeader({
		name: 'authorization',
		description: 'Bearer <Token>',
		required: true,
	})
	@ApiResponse({ status: 200, description: 'The current session' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	getSession(@Token() token: string): ControllerResponse<Session> {
		const session = this.authService.decodeSession(token);

		return { data: session };
	}

	@Post('login')
	@ApiOperation({ summary: 'Log in a user' })
	@ApiResponse({ status: 201, description: 'The JWT token' })
	@ApiResponse({ status: 400, description: 'Bad request' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiResponse({ status: 401, description: 'Invalid password' })
	async loginUser(
		@Body(LoginValidationPipe) credentials: LoginDto,
	): Promise<ControllerResponse<string>> {
		const token = await this.authService.loginUser(credentials);

		return { data: token };
	}

	@Patch('session')
	@ApiOperation({ summary: 'Refresh the current session' })
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer <Token>',
		required: true,
	})
	@ApiResponse({ status: 200, description: 'The new JWT token' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	refreshToken(@Token() token: string): ControllerResponse<string> {
		const newToken = this.authService.refreshToken(token);

		return { data: newToken };
	}

	@Delete('session')
	@ApiOperation({ summary: 'Log out a user' })
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer <Token>',
		required: true,
	})
	@ApiResponse({ status: 200, description: 'User logged out successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	logoutUser(@Token() token: string): ControllerResponse<null> {
		this.authService.logoutUser(token);

		return { message: 'User logged out successfully.' };
	}
}

import type { ControllerResponse } from '@types';

import { LoginDto, LoginValidationPipe } from '@auth/auth.dto';
import { AuthService } from '@auth/auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	loginUser(
		@Body(LoginValidationPipe) credentials: LoginDto,
	): ControllerResponse<string> {
		const token = this.authService.loginUser(credentials);

		return { data: token };
	}
}

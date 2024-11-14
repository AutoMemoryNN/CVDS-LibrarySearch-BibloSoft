import type { ControllerResponse } from '@types';

import { LoginDto, LoginValidationPipe } from '@auth/auth.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	@Post('login')
	loginUser(
		@Body(LoginValidationPipe) body: LoginDto,
	): ControllerResponse<LoginDto> {
		return { data: body };
	}
}

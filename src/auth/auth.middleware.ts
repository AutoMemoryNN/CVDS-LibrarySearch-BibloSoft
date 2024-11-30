import type { NestMiddleware } from '@nestjs/common';
import type { RequestWithSession } from '@types';
import type { NextFunction, Response } from 'express';

import { InvalidTokenException } from '@auth/auth.exceptions';
import { AuthService } from '@auth/auth.service';
import { Injectable } from '@nestjs/common';

/**
 * Middleware to handle authentication using bearer tokens.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private authService: AuthService) {}

	/**
	 * Extracts the Bearer token from the Authorization header and decodes it
	 * to extract the session data.
	 *
	 * @param request - The incoming HTTP request.
	 * @param _response - The outgoing HTTP response.
	 * @param next - The callback function to pass control to the
	 *
	 * @throws HttpException - If the authorization header is missing or does not start with 'Bearer '.
	 */
	use(
		request: RequestWithSession,
		_response: Response,
		next: NextFunction,
	): void {
		const authorization = request.headers.authorization;

		if (!authorization || !authorization.startsWith('Bearer ')) {
			throw new InvalidTokenException();
		}

		const token = authorization.split(' ')[1];
		const session = this.authService.decodeSession(token);

		request.session = session;

		next();
	}
}

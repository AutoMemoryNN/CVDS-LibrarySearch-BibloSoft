import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { InvalidTokenException } from '@auth/auth.exceptions';

/**
 * A guard that determines if the current request is authorized to proceed.
 */
export class AuthGuard implements CanActivate {
	/**
	 * Determines if the current request is authorized to proceed.
	 *
	 * @param context - The execution context which provides details about the current request.
	 * @returns A boolean indicating whether the request is authorized.
	 * @throws HttpException - If the authorization header is missing or does not start with 'Bearer '.
	 */
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();
		const authorization = request.headers.authorization;

		if (!authorization || !authorization.startsWith('Bearer ')) {
			throw new InvalidTokenException();
		}

		return true;
	}
}

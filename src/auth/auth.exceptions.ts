import type { LoginDto } from '@auth/auth.dto';

import { AppException } from '@app/app.exceptions';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when an invalid password is provided during authentication.
 *
 * This exception extends the `AppException` class and is used to indicate
 * that the provided password does not meet the required criteria.
 *
 * @extends {AppException<LoginDto>}
 */
export class InvalidPasswordException extends AppException<LoginDto> {
	constructor() {
		super(
			{
				password: 'Invalid password',
			},
			HttpStatus.UNAUTHORIZED,
		);
	}
}

/**
 * Exception thrown when an invalid token is provided during authentication.
 *
 * This exception extends the `HttpException` class and is used to indicate
 * that the provided token is missing or invalid.
 *
 * @extends {HttpException}
 */
export class InvalidTokenException extends HttpException {
	constructor() {
		super('Missing or invalid token', HttpStatus.UNAUTHORIZED);
	}
}

/**
 * Exception thrown when a session is not found during authentication.
 *
 * This exception extends the `HttpException` class and is used to indicate
 * that the session associated with the provided token could not be found.
 *
 * @extends {HttpException}
 */
export class SessionNotFoundException extends HttpException {
	constructor() {
		super('Session not found', HttpStatus.UNAUTHORIZED);
	}
}

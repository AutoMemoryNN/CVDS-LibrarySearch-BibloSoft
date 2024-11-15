import type { LoginDto } from '@auth/auth.dto';

import { AppException } from '@app/app.exceptions';
import { HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when a user is not found.
 *
 * This exception extends the `AppException` class and is used to indicate
 * that a user with the specified username does not exist in the system.
 *
 * @extends {AppException<LoginDto>}
 */
export class UserNotFoundException extends AppException<LoginDto> {
	constructor() {
		super(
			{
				username: 'Username not found',
			},
			HttpStatus.NOT_FOUND,
		);
	}
}

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

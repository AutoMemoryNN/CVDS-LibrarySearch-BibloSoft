import type { LoginDto } from '@auth/auth.dto';

import { AppException } from '@app/app.exceptions';
import { HttpStatus } from '@nestjs/common';

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

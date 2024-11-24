import { AppException } from '@app/app.exceptions';
import { UserSelect } from '@database/users/users.schema';
import { HttpStatus } from '@nestjs/common';
import { NewUserDto } from './users.dto';

/**
 * Exception thrown when a user is not found.
 *
 * This exception extends the `AppException` class and is used to indicate
 * that a user with the specified id does not exist in the system.
 *
 * @extends {AppException<UserSelect>}
 */
export class UserIdNotFoundException extends AppException<UserSelect> {
	constructor() {
		super(
			{
				id: 'User id not found',
			},
			HttpStatus.NOT_FOUND,
		);
	}
}

/**
 * Exception thrown when a user is not found.
 *
 * This exception extends the `AppException` class and is used to indicate
 * that a user with the specified username does not exist in the system.
 *
 * @extends {AppException<UserSelect>}
 */
export class UserUsernameNotFoundException extends AppException<UserSelect> {
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
 * Exception thrown when a user conflict occurs.
 *
 * This exception extends the `AppException` class and is used to indicate
 * that a user with the specified username already exists in the system.
 *
 * @extends {AppException<NewUserDto>}
 */
export class UserConflictException extends AppException<NewUserDto> {
	constructor() {
		super(
			{
				username: 'Username already exists',
			},
			HttpStatus.CONFLICT,
		);
	}
}

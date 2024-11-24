import { AppException } from '@app/app.exceptions';
import { UserSelect } from '@database/users/users.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NewUserDto } from '@users/users.dto';

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

/**
 * Exception thrown when a user has insufficient permissions to perform an action.
 *
 * This exception extends the `HttpException` class and is used to indicate
 * that the user does not have sufficient permissions to perform an action.
 *
 * @extends {HttpException}
 */
export class InsufficientPermissionsException extends HttpException {
	constructor() {
		super('Insufficient permissions', HttpStatus.FORBIDDEN);
	}
}

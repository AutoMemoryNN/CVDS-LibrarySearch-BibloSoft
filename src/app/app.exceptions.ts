import type { Errors } from '@types';
import type { ZodError } from 'zod';

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception for handling application errors.
 *
 * This exception is used to handle application errors. It extends the
 * `HttpException` class and adds a property for storing the errors.
 */
export class AppException<T> extends HttpException {
	errors: Errors<T>;

	/**
	 * Creates an application exception.
	 *
	 * This constructor creates an application exception with the given errors
	 * and status code.
	 *
	 * @param errors - The errors to include in the exception.
	 * @param statusCode - The status code of the exception.
	 */
	constructor(errors: Errors<T>, statusCode: number) {
		super({ errors }, statusCode);
		this.errors = errors;
	}

	/**
	 * Creates an application exception from a Zod error.
	 *
	 * This method creates an application exception from a Zod error. It
	 * converts the Zod error into a dictionary of errors and returns an
	 * application exception with the errors.
	 *
	 * @param error - The Zod error to convert.
	 * @returns The application exception with the errors.
	 */
	static fromZodError<T>(error: ZodError<T>): AppException<T> {
		const errors = {} as Errors<T>;

		for (const issue of error.errors) {
			const key = issue.path.join('.') as keyof T;
			errors[key] = issue.message;
		}

		return new AppException(errors, HttpStatus.BAD_REQUEST);
	}

	/**
	 * Adds an error to the exception.
	 *
	 * This method adds an error to the exception. It takes a key and an error
	 * message and adds them to the errors dictionary.
	 *
	 * @param key - The key of the error.
	 * @param error - The error message.
	 */
	addError(key: keyof T, error: string): void {
		this.errors[key] = error;
	}

	/**
	 * Checks if the exception has errors.
	 *
	 * This method checks if the exception has errors. It returns `true` if the
	 * errors dictionary is not empty and `false` otherwise.
	 *
	 * @returns `true` if the exception has errors, `false` otherwise.
	 */
	hasErrors(): boolean {
		return Object.keys(this.errors).length > 0;
	}
}

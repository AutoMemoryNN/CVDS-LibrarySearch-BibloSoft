import { AppException } from '@app/app.exceptions';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

/**
 * Schema for validating login credentials.
 *
 * This schema ensures that the `username` and `password` fields are strings
 * with a maximum length of 50 characters.
 *
 * @property {string} username - The username of the user. Must be a string with a maximum length of 50 characters.
 * @property {string} password - The password of the user. Must be a string with a maximum length of 50 characters.
 */
const loginSchema = z.object({
	username: z.string().max(50),
	password: z.string().max(50),
});

/**
 * Type of the login schema.
 *
 * This type is used to infer the type of the login schema.
 */
export class LoginDto {
	@ApiProperty({
		example: 'admin',
		description: 'The username of the user',
	})
	username: string;

	@ApiProperty({
		example: 'admin',
		description: 'The password of the user',
	})
	password: string;

	constructor(data: unknown) {
		const parsedData = loginSchema.safeParse(data);

		if (!parsedData.success) {
			throw AppException.fromZodError(parsedData.error);
		}

		this.username = parsedData.data.username;
		this.password = parsedData.data.password;
	}
}

/**
 * Pipe for validating login credentials.
 *
 * This pipe validates the login credentials using the login schema. If the
 * credentials are valid, it returns the credentials. Otherwise, it throws an
 * exception with the error message.
 */
export class LoginValidationPipe implements PipeTransform {
	transform(value: unknown, _metadata: ArgumentMetadata): LoginDto {
		const result = loginSchema.safeParse(value);

		if (result.success) {
			return result.data;
		}

		throw AppException.fromZodError(result.error);
	}
}

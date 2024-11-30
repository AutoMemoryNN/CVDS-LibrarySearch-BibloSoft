import { AppException } from '@app/app.exceptions';
import { UserRole } from '@database/users/users.schema';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

/**
 * Schema for validating new user data.
 *
 * This schema ensures that the `username` and `password` fields are strings with a maximum length of 50 characters.
 * The `role` field must be a valid value from the `UserRole` enum.
 */
export const newUserSchema = z.object({
	username: z.string().max(50).min(1),
	password: z.string().max(50).min(1),
	role: z.nativeEnum(UserRole),
});

/**
 * Schema for updating a user.
 *
 * This schema validates the structure of the data required to update a user.
 *
 * Properties:
 * - `id` (string): The unique identifier of the user. This field is required.
 * - `username` (string, optional): The username of the user. It can have a maximum length of 50 characters.
 * - `password` (string, optional): The password of the user. It can have a maximum length of 50 characters.
 * - `role` (UserRole, optional): The role of the user. It must be a valid value from the `UserRole` enum.
 */
export const updateUserSchema = z.object({
	id: z.string(),
	username: z.string().max(50).optional(),
	password: z.string().max(50).optional(),
	role: z.nativeEnum(UserRole).optional(),
});

/**
 * Data Transfer Object (DTO) for creating a new user.
 *
 * @class NewUserDto
 * @property username - The username of the new user.
 * @property password - The password of the new user.
 * @property role - The role assigned to the new user.
 *
 * @throws Throws an exception if the input data is invalid according to the schema.
 */
export class NewUserDto {
	@ApiProperty({
		example: 'cvds',
		description: 'The username of the user',
	})
	username: string;

	@ApiProperty({
		example: 'password',
		description: 'The password of the user',
	})
	password: string;

	@ApiProperty({
		example: 'admin',
		description: 'The role of the user',
	})
	role: UserRole;

	constructor(data: unknown) {
		const parsedData = newUserSchema.safeParse(data);

		if (!parsedData.success) {
			throw AppException.fromZodError(parsedData.error);
		}

		this.username = parsedData.data.username;
		this.password = parsedData.data.password;
		this.role = parsedData.data.role;
	}
}

/**
 * Data Transfer Object (DTO) for updating a user.
 *
 * This class is used to validate and transfer data when updating a user.
 * It uses a schema to parse and validate the input data.
 *
 * @class UpdateUserDto
 *
 * @property id - The unique identifier of the user.
 * @property [username] - The username of the user (optional).
 * @property [password] - The password of the user (optional).
 * @property [role] - The role of the user (optional).
 *
 * @throws Throws an exception if the input data is invalid according to the schema.
 */
export class UpdateUserDto {
	@ApiProperty({
		example: '1',
		description: 'The unique identifier of the user',
	})
	id: string;

	@ApiProperty({
		example: 'cvds',
		description: 'The username of the user',
	})
	username?: string;

	@ApiProperty({
		example: 'password',
		description: 'The password of the user',
	})
	password?: string;

	@ApiProperty({
		example: 'admin',
		description: 'The role of the user',
	})
	role?: UserRole;

	constructor(data: unknown) {
		const parsedData = updateUserSchema.safeParse(data);

		if (!parsedData.success) {
			throw AppException.fromZodError(parsedData.error);
		}

		this.id = parsedData.data.id;
		this.username = parsedData.data.username;
		this.password = parsedData.data.password;
		this.role = parsedData.data.role;
	}
}

/**
 * A pipe that validates and transforms incoming data into a `NewUserDto` object.
 *
 * This pipe uses the `newUserSchema` to validate the incoming data. If the data
 * is valid, it transforms the data into a `NewUserDto` object. If the data is
 * invalid, it throws an `AppException` with the validation errors.
 *
 */
export class NewUserValidationPipe implements PipeTransform {
	transform(value: unknown, _metadata: ArgumentMetadata): NewUserDto {
		const result = newUserSchema.safeParse(value);

		if (result.success) {
			return new NewUserDto(result.data);
		}

		throw AppException.fromZodError(result.error);
	}
}

/**
 * A pipe that validates and transforms the input data for updating a user.
 * It uses the `updateUserSchema` to validate the input and throws an `AppException`
 * if the validation fails.
 *
 */
export class UpdateUserValidationPipe implements PipeTransform {
	transform(value: unknown, _metadata: ArgumentMetadata): UpdateUserDto {
		const result = updateUserSchema.safeParse(value);

		if (result.success) {
			return new UpdateUserDto(result.data);
		}

		throw AppException.fromZodError(result.error);
	}
}

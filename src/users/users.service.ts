import { AppTokens } from '@app/app.tokens';
import { UserSelect } from '@database/users/users.schema';
import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundException } from '@users/users.exceptions';
import { UserRepository } from '@users/users.repository';

@Injectable()
export class UsersService {
	constructor(
		@Inject(AppTokens.USER_REPOSITORY)
		private readonly userRepository: UserRepository,
	) {}

	/**
	 * Retrieves a user by their ID.
	 *
	 * @param id - The ID of the user to retrieve.
	 * @returns A promise that resolves to the selected user.
	 * @throws If no user is found with the given ID.
	 */
	async getUserById(id: string): Promise<UserSelect> {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Retrieves a user by their username.
	 *
	 * @param username - The username of the user to retrieve.
	 * @returns A promise that resolves to the user data.
	 * @throws If no user is found with the given username.
	 */
	async getUserByUsername(username: string): Promise<UserSelect> {
		const user = await this.userRepository.findByUsername(username);

		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}
}

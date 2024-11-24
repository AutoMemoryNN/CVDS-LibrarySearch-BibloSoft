import type { ControllerResponse } from '@types';

import { PublicUser } from '@database/users/users.schema';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import {
	NewUserDto,
	NewUserValidationPipe,
	UpdateUserDto,
	UpdateUserValidationPipe,
} from '@users/users.dto';
import { UsersService } from '@users/users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Post()
	async createUser(
		@Body(NewUserValidationPipe) user: NewUserDto,
	): Promise<ControllerResponse<PublicUser>> {
		const newUser = await this.userService.createUser(user);

		return { data: newUser };
	}

	@Patch()
	async updateUser(
		@Body(UpdateUserValidationPipe) user: UpdateUserDto,
	): Promise<ControllerResponse<PublicUser>> {
		const updatedUser = await this.userService.updateUser(user);

		return { data: updatedUser };
	}

	@Delete('/:id')
	async deleteUser(
		@Param('id') id: string,
	): Promise<ControllerResponse<PublicUser>> {
		const deletedUser = await this.userService.deleteUser(id);

		return { data: deletedUser };
	}
}

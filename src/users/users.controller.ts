import type { ControllerResponse, Session } from '@types';

import { SessionData } from '@auth/auth.decorators';
import { PublicUser } from '@database/users/users.schema';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
	NewUserDto,
	NewUserValidationPipe,
	UpdateUserDto,
	UpdateUserValidationPipe,
} from '@users/users.dto';
import { UsersService } from '@users/users.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new user' })
	@ApiResponse({ status: 201, description: 'The new user' })
	@ApiResponse({ status: 400, description: 'Invalid request data' })
	@ApiResponse({ status: 409, description: 'User already exists' })
	async createUser(
		@Body(NewUserValidationPipe) user: NewUserDto,
	): Promise<ControllerResponse<PublicUser>> {
		const newUser = await this.userService.createUser(user);

		return { data: newUser };
	}

	@Patch()
	@ApiOperation({ summary: 'Update a user' })
	@ApiResponse({ status: 200, description: 'The updated user' })
	@ApiResponse({ status: 400, description: 'Invalid request data' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiResponse({ status: 409, description: 'User already exists' })
	async updateUser(
		@Body(UpdateUserValidationPipe) user: UpdateUserDto,
		@SessionData() session: Session,
	): Promise<ControllerResponse<PublicUser>> {
		const updatedUser = await this.userService.updateUser(user, session);

		return { data: updatedUser };
	}

	@Delete('/:id')
	@ApiOperation({ summary: 'Delete a user' })
	@ApiResponse({ status: 200, description: 'The deleted user' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async deleteUser(
		@Param('id') id: string,
		@SessionData() session: Session,
	): Promise<ControllerResponse<PublicUser>> {
		const deletedUser = await this.userService.deleteUser(id, session);

		return { data: deletedUser };
	}
}

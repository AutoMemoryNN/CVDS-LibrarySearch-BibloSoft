import { HttpStatus, type INestApplication } from '@nestjs/common';

import { AppModule } from '@app/app.module';
import { AppTokens } from '@app/app.tokens';
import { UserInsert, UserRole } from '@database/users/users.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { UserMemoryRepository } from '@users/users.repository';
import { spec } from 'pactum';
import { afterAll, beforeAll, describe, it } from 'vitest';

/**
 * Test suite for the UsersController
 */
describe('UsersController', () => {
	let app: INestApplication;
	const port = 7358;
	const endpoint = `http://localhost:${port}`;
	const timeLimit = 500;

	const buildStudent = (): UserInsert => {
		return {
			username: `user-${Math.random()}`,
			password: `password-${Math.random()}`,
			role: UserRole.STUDENT,
		};
	};

	const buildAdmin = (): UserInsert => {
		return {
			username:
				process.env.SUPER_ADMIN_USERNAME || `user-${Math.random()}`,
			password:
				process.env.SUPER_ADMIN_PASSWORD || `password-${Math.random()}`,
			role: UserRole.ADMIN,
		};
	};

	let testUser = buildStudent();
	const testAdmin = buildAdmin();

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(AppTokens.USERS_DATABASE)
			.useValue(new UserMemoryRepository())
			.compile();

		app = module.createNestApplication();

		await app.init();
		await app.listen(port);
	});

	afterAll(async () => {
		await app.close();
	});

	/**
	 * Test the UsersController#createUser method
	 */
	describe('createUser', () => {
		afterAll(async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			await spec()
				.delete(`${endpoint}/users/${testUser.id}`)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.OK);
		});

		it('should create a user', async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const user = testUser;
			const { password, ...createdUser } = user;
			const expectedBody = {
				data: createdUser,
			};

			const result = await spec()
				.post(`${endpoint}/users`)
				.withBody(user)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.expectJsonLike(expectedBody)
				.returns('data');

			testUser = { ...testUser, id: result.id };
		});

		it('should return 400 if the username is empty', async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const user = testUser;
			const expectedBody = {
				statusCode: 400,
				errors: {
					username: 'String must contain at least 1 character(s)',
				},
			};

			await spec()
				.post(`${endpoint}/users`)
				.withBody({ ...user, username: '' })
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.BAD_REQUEST)
				.expectJsonLike(expectedBody);
		});

		it('should return 400 if the password is empty', async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const user = testUser;
			const expectedBody = {
				statusCode: 400,
				errors: {
					password: 'String must contain at least 1 character(s)',
				},
			};

			await spec()
				.post(`${endpoint}/users`)
				.withBody({ ...user, password: '' })
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.BAD_REQUEST)
				.expectJsonLike(expectedBody);
		});

		it('should return 400 if the role is invalid', async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const invalidRole = 'invalid';
			const user = testUser;
			const expectedBody = {
				statusCode: 400,
				errors: {
					role: `Invalid enum value. Expected 'student' | 'admin', received '${invalidRole}'`,
				},
			};

			await spec()
				.post(`${endpoint}/users`)
				.withBody({ ...user, role: 'invalid' })
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.BAD_REQUEST)
				.expectJsonLike(expectedBody);
		});

		it('should return 409 if the user already exists', async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const user = testUser;
			const expectedBody = {
				statusCode: 409,
				errors: {
					username: 'Username already exists',
				},
			};

			await spec()
				.post(`${endpoint}/users`)
				.withBody(user)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CONFLICT)
				.expectJsonLike(expectedBody);
		});
	});

	/**
	 * Test the UsersController#updateUser method
	 */
	describe('updateUser', () => {
		beforeAll(async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			await spec()
				.post(`${endpoint}/users`)
				.withBody(testUser)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');
		});

		afterAll(async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			await spec()
				.delete(`${endpoint}/users/${testUser.id}`)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.OK);
		});

		it('should update a user', async () => {
			const user = testUser;
			const updatedUser = {
				...user,
				username: `updated-${user.username}`,
			};
			const userCredentials = {
				username: user.username,
				password: user.password,
			};

			const { password, ...expectedBody } = updatedUser;

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(userCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			await spec()
				.patch(`${endpoint}/users`)
				.withBody(updatedUser)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.OK)
				.expectJsonLike({ data: expectedBody });

			await spec()
				.patch(`${endpoint}/users`)
				.withBody(testUser)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.OK);
		});

		it('should return 400 if the user id is missing', async () => {
			const user = testUser;
			const userCredentials = {
				username: user.username,
				password: user.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(userCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const expectedBody = {
				statusCode: 400,
				errors: {
					id: 'Required',
				},
			};

			await spec()
				.patch(`${endpoint}/users`)
				.withBody({ username: 'updated' })
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.BAD_REQUEST)
				.expectJsonLike(expectedBody);
		});

		it('should return 403 if the user tries to update another user', async () => {
			const user = testUser;
			const userCredentials = {
				username: user.username,
				password: user.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(userCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const expectedBody = {
				statusCode: 403,
				message: 'Insufficient permissions',
			};

			await spec()
				.patch(`${endpoint}/users`)
				.withBody({ id: 'invalid' })
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.FORBIDDEN)
				.expectJsonLike(expectedBody);
		});

		it('should return 401 if no token is provided', async () => {
			const user = testUser;
			const expectedBody = {
				statusCode: 401,
				message: 'Missing or invalid token',
			};

			await spec()
				.patch(`${endpoint}/users`)
				.withBody(user)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.UNAUTHORIZED)
				.expectJsonLike(expectedBody);
		});

		it('should return 200 if all fields are missing', async () => {
			const user = testUser;

			const userCredentials = {
				username: user.username,
				password: user.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(userCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			await spec()
				.patch(`${endpoint}/users`)
				.withBody({ id: user.id })
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.OK);
		});
	});

	/**
	 * Test the UsersController#deleteUser method
	 */

	describe('deleteUser', () => {
		beforeAll(async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			await spec()
				.post(`${endpoint}/users`)
				.withBody(testUser)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');
		});

		afterAll(async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			await spec()
				.delete(`${endpoint}/users/${testUser.id}`)
				.withBearerToken(token)
				.expectResponseTime(timeLimit);
		});

		it('should delete a user', async () => {
			const user = testUser;
			const userCredentials = {
				username: user.username,
				password: user.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(userCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const { password, ...expectedBody } = user;

			await spec()
				.delete(`${endpoint}/users/${user.id}`)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.OK)
				.expectJsonLike({ data: expectedBody });
		});

		it('should return 401 if no token is provided', async () => {
			const user = testUser;
			const expectedBody = {
				statusCode: 401,
				message: 'Missing or invalid token',
			};

			await spec()
				.delete(`${endpoint}/users/${user.id}`)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.UNAUTHORIZED)
				.expectJsonLike(expectedBody);
		});

		it('should return 403 if the user tries to delete another user', async () => {
			const adminCredentials = {
				username: testAdmin.username,
				password: testAdmin.password,
			};

			const adminToken = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(adminCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			await spec()
				.post(`${endpoint}/users`)
				.withBody(testUser)
				.withBearerToken(adminToken)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const user = testUser;
			const userCredentials = {
				username: user.username,
				password: user.password,
			};

			const token = await spec()
				.post(`${endpoint}/auth/login`)
				.withBody(userCredentials)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.CREATED)
				.returns('data');

			const expectedBody = {
				statusCode: 403,
				message: 'Insufficient permissions',
			};

			await spec()
				.delete(`${endpoint}/users/${testAdmin.id}`)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.FORBIDDEN)
				.expectJsonLike(expectedBody);

			await spec()
				.delete(`${endpoint}/users/${testAdmin.id}`)
				.withBearerToken(token)
				.expectResponseTime(timeLimit)
				.expectStatus(HttpStatus.FORBIDDEN)
				.expectJsonLike(expectedBody);
		});
	});
});

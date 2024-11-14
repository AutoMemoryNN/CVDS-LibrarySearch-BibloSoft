import type { INestApplication } from '@nestjs/common';

import { AppModule } from '@app/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { spec } from 'pactum';
import { afterAll, beforeAll, describe, it } from 'vitest';

/**
 * Test suite for the HealthController
 */
describe('HealthController', () => {
	let app: INestApplication;
	const port = 7357;
	const endpoint = `http://localhost:${port}`;
	const timeLimit = 50;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = module.createNestApplication();

		await app.init();
		await app.listen(port);
	});

	afterAll(async () => {
		await app.close();
	});

	/**
	 * Test the HealthController#getHealth method
	 */
	describe('getHealth', () => {
		/**
		 * Test if the getHealth method returns the correct message
		 */
		it('should return "Server is up and running"', async () => {
			const expectedBody = { message: 'Server is up and running' };

			await spec()
				.get(`${endpoint}/health`)
				.expectResponseTime(timeLimit)
				.expectJson(expectedBody)
				.expectStatus(200);
		});
	});

	/**
	 * Test the HealthController#getPing method
	 */
	describe('getPing', () => {
		/**
		 * Test if the getPing method returns the correct message
		 */
		it('should return "pong"', async () => {
			const expectedBody = { message: 'pong' };

			await spec()
				.get(`${endpoint}/health/ping`)
				.expectResponseTime(timeLimit)
				.expectJson(expectedBody)
				.expectStatus(200);
		});
	});
});

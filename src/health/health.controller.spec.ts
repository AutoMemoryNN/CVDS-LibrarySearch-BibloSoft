import { HealthController } from '@health/health.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * Test suite for the HealthController
 */
describe('HealthController', () => {
	let healthController: HealthController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [HealthController],
		}).compile();

		healthController = app.get<HealthController>(HealthController);
	});

	/**
	 * Test the HealthController#getHealth method
	 */
	describe('getHealth', () => {
		/**
		 * Test if the getHealth method returns the correct message
		 */
		it('should return "Server is up and running"', () => {
			expect(healthController.getHealth()).toEqual({
				message: 'Server is up and running',
			});
		});
	});

	/**
	 * Test the HealthController#getPing method
	 */
	describe('getPing', () => {
		/**
		 * Test if the getPing method returns the correct message
		 */
		it('should return "pong"', () => {
			expect(healthController.getPing()).toEqual({
				message: 'pong',
			});
		});
	});
});

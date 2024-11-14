import type { ControllerResponse } from '@types';

import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
	@Get()
	getHealth(): ControllerResponse {
		return {
			message: 'Server is up and running',
		};
	}

	@Get('ping')
	getPing(): ControllerResponse {
		return {
			message: 'pong',
		};
	}
}

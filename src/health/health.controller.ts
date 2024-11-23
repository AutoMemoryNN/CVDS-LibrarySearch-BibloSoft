import type { ControllerResponse } from '@types';

import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
	@Get('ping')
	getPing(): ControllerResponse {
		return {
			message: 'pong',
		};
	}
}

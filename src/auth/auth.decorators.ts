import type { ExecutionContext } from '@nestjs/common';
import type { RequestWithSession } from '@types';

import { createParamDecorator } from '@nestjs/common';

/**
 * Custom decorator to extract the session from the request object.
 *
 * This decorator can be used in controller methods to access the session data
 * associated with the current request. If the session does not exist, it returns null.
 *
 * @param _data - Unused parameter.
 * @param context - The execution context which provides access to the request object.
 * @returns The session object if it exists, otherwise null.
 */
export const Session = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<RequestWithSession>();

		if (!request.session) {
			return null;
		}

		return request.session;
	},
);

/**
 * Custom decorator to extract the Bearer token from the Authorization header
 * of an incoming HTTP request.
 *
 * @param _data - Unused parameter.
 * @param context - The execution context of the request.
 * @returns The Bearer token if present, otherwise null.
 */
export const Token = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<RequestWithSession>();
		const authorization = request.headers.authorization;

		if (!authorization || !authorization.startsWith('Bearer ')) {
			return null;
		}

		return authorization.split(' ')[1];
	},
);

import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

/**
 * Middleware that logs incoming HTTP requests.
 *
 * @class
 * @implements {NestMiddleware}
 */
export class AppMiddleware implements NestMiddleware {
	/**
	 * Logger instance for logging request details.
	 *
	 * @private
	 * @readonly
	 */
	private readonly logger = new Logger(AppMiddleware.name);

	/**
	 * Logs the details of incoming HTTP requests including method, path, origin IP, user agent, and authorization header.
	 *
	 * @param req - The incoming HTTP request.
	 * @param _res - The outgoing HTTP response (unused).
	 * @param  next - The next middleware function in the stack.
	 */
	use(req: Request, _res: Response, next: NextFunction): void {
		const method = req.method;
		const path = req.baseUrl + req.path;
		const from =
			req.ip ||
			req.hostname ||
			req.socket.remoteAddress ||
			req.headers['x-forwarded-for'];

		const userAgent = req.headers['user-agent'] || 'unknown';
		const authHeader = req.headers.authorization || 'no-auth';

		this.logger.log(
			`Request {${path}, ${method}, ${from}} {User agent, ${userAgent}} {Auth, ${authHeader}}`,
		);
		next();
	}
}

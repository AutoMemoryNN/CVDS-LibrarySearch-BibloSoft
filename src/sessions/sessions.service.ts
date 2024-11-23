import { AppTokens } from '@app/app.tokens';
import { Inject, Injectable } from '@nestjs/common';
import { SessionsManagerRepository } from './sessions.repository';

/**
 * Service for managing user sessions.
 */
@Injectable()
export class SessionManagerService {
	constructor(
		@Inject(AppTokens.SESSIONS_REPOSITORY)
		private readonly sessionRepository: SessionsManagerRepository,
	) {}

	/**
	 * Adds a new session with the given token.
	 * @param token - The token representing the session to be added.
	 */
	addSession(token: string): void {
		this.sessionRepository.addSession(token);
	}

	/**
	 * Updates an existing session with a new token.
	 * @param oldToken - The token representing the session to be updated.
	 * @param newToken - The new token to replace the old token.
	 */
	patchSession(oldToken: string, newToken: string): void {
		this.sessionRepository.patchSession(oldToken, newToken);
	}

	/**
	 * Removes a session with the given token.
	 * @param token - The token representing the session to be removed.
	 */
	removeSession(token: string): void {
		this.sessionRepository.removeSession(token);
	}

	/**
	 * Checks if a session with the given token exists.
	 * @param token - The token representing the session to be checked.
	 * @returns A boolean indicating whether the session exists.
	 */
	hasSession(token: string): boolean {
		return this.sessionRepository.hasSession(token);
	}
}

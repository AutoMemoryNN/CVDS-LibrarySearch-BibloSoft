import { Injectable } from '@nestjs/common';

/**
 * Interface representing a repository for managing sessions.
 */
export interface SessionsManagerRepository {
	/**
	 * Checks if a session exists for the given token.
	 * @param token - The token to check for an existing session.
	 * @returns `true` if the session exists, otherwise `false`.
	 */
	hasSession(token: string): boolean;

	/**
	 * Adds a new session with the given token.
	 * @param token - The token for the new session.
	 */
	addSession(token: string): void;

	/**
	 * Updates an existing session by replacing the old token with a new token.
	 * @param oldToken - The token of the existing session to be updated.
	 * @param newToken - The new token to replace the old token.
	 */
	patchSession(oldToken: string, newToken: string): void;

	/**
	 * Removes the session associated with the given token.
	 * @param token - The token of the session to be removed.
	 */
	removeSession(token: string): void;
}

/**
 * A simple in-memory repository for managing sessions.
 */
@Injectable()
export class MemorySessionManager implements SessionsManagerRepository {
	sessions: Set<string>;

	constructor() {
		this.sessions = new Set();
	}

	hasSession(token: string): boolean {
		return this.sessions.has(token);
	}

	addSession(token: string): void {
		this.sessions.add(token);
	}

	patchSession(oldToken: string, newToken: string): void {
		this.sessions.delete(oldToken);
		this.sessions.add(newToken);
	}

	removeSession(token: string): void {
		this.sessions.delete(token);
	}
}

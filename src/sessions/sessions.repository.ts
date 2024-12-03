import type { Session } from '@types';

import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';

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

	/**
	 * Cleans up any expired sessions.
	 */
	cleanupSessions(): void;
}

/**
 * A simple in-memory repository for managing sessions.
 */
@Injectable()
export class MemorySessionManager implements SessionsManagerRepository {
	private readonly sessions: Map<string, number>;
	private readonly logger = new Logger(MemorySessionManager.name);

	constructor(private readonly jwtService: JwtService) {
		this.sessions = new Map();
	}

	hasSession(token: string): boolean {
		return this.sessions.has(token);
	}

	addSession(token: string): void {
		try {
			const decoded = this.jwtService.decode(token) as Session;
			this.sessions.set(token, decoded.exp);
		} catch (_error) {
			this.logger.error(`Failed to add session for token: ${token}`);
		}
	}

	patchSession(oldToken: string, newToken: string): void {
		try {
			const decoded = this.jwtService.decode(newToken) as Session;
			this.sessions.delete(oldToken);
			this.sessions.set(newToken, decoded.exp);
		} catch (_error) {
			this.logger.error(
				`Failed to update session for token: ${oldToken}`,
			);
			this.sessions.delete(oldToken);
		}
	}

	removeSession(token: string): void {
		this.sessions.delete(token);
	}

	@Cron(CronExpression.EVERY_3_HOURS)
	cleanupSessions(): void {
		const prevLength = this.sessions.size;
		const now = Math.ceil(Date.now() / 1000);

		for (const [token, exp] of this.sessions.entries()) {
			try {
				if (exp < now) {
					this.sessions.delete(token);
				}
			} catch (_error) {
				this.logger.error(
					`Failed to cleanup session for token: ${token}`,
				);
				this.sessions.delete(token);
			}
		}

		const newLength = this.sessions.size;

		this.logger.log(
			`Cleaned up ${prevLength - newLength} expired sessions`,
		);
	}
}

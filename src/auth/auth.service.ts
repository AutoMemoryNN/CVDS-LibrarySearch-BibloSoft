import type { JwtPayload, Session } from '@types';

import { LoginDto } from '@auth/auth.dto';
import { InvalidPasswordException } from '@auth/auth.exceptions';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionManagerService } from '@sessions/sessions.service';
import { UserNotFoundException } from '@users/users.exceptions';
import { UsersService } from '@users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly sessionManager: SessionManagerService,
	) {}

	/**
	 * Authenticates a user based on provided credentials.
	 *
	 * @param credentials - The login credentials containing username and password.
	 * @returns A signed session token if authentication is successful.
	 * @throws If the username is not 'admin'.
	 * @throws If the password is not 'admin'.
	 */
	async loginUser(credentials: LoginDto): Promise<string> {
		const user = await this.usersService.getUserByUsername(
			credentials.username,
		);

		if (credentials.username !== user.username) {
			throw new UserNotFoundException();
		}

		if (credentials.password !== user.password) {
			throw new InvalidPasswordException();
		}

		const payload = {
			username: credentials.username,
		};

		const token = this.signSession(payload);
		this.sessionManager.addSession(token);

		return token;
	}

	/**
	 * Signs a JWT payload and returns the signed token as a string.
	 *
	 * @param payload - The JWT payload to be signed.
	 * @returns The signed JWT token as a string.
	 */
	signSession(payload: JwtPayload): string {
		return this.jwtService.sign(payload);
	}

	/**
	 * Decodes a session token and returns the session information.
	 *
	 * @param token - The JWT token to decode.
	 * @returns The decoded session information.
	 * @throws HttpException - If the token is invalid or cannot be verified.
	 */
	decodeSession(token: string): Session {
		try {
			if (!this.sessionManager.hasSession(token)) {
				throw new HttpException(
					'Invalid token',
					HttpStatus.UNAUTHORIZED,
				);
			}

			return this.jwtService.verify(token);
		} catch {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
	}

	/**
	 * Refreshes a session token by decoding the provided token and signing a new one.
	 *
	 * @param token - The JWT token to refresh.
	 * @returns A new signed JWT token.
	 * @throws HttpException - If the token is invalid or cannot be verified.
	 */
	refreshToken(token: string): string {
		const { iat, exp, ...session } = this.decodeSession(token);
		const newToken = this.signSession(session);

		this.sessionManager.patchSession(token, newToken);

		return newToken;
	}

	/**
	 * Removes a session token from the session manager.
	 *
	 * @param token - The JWT token to remove.
	 */
	logoutUser(token: string): void {
		if (!this.sessionManager.hasSession(token)) {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}

		this.sessionManager.removeSession(token);
	}
}

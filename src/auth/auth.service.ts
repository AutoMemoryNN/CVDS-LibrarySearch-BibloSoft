import type { JwtPayload, Session } from '@types';

import { LoginDto } from '@auth/auth.dto';
import {
	InvalidPasswordException,
	UserNotFoundException,
} from '@auth/auth.exceptions';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	/**
	 * Authenticates a user based on provided credentials.
	 *
	 * @param {LoginDto} credentials - The login credentials containing username and password.
	 * @returns {string} - A signed session token if authentication is successful.
	 * @throws {UserNotFoundException} - If the username is not 'admin'.
	 * @throws {InvalidPasswordException} - If the password is not 'admin'.
	 */
	loginUser(credentials: LoginDto): string {
		if (credentials.username !== 'admin') {
			throw new UserNotFoundException();
		}

		if (credentials.password !== 'admin') {
			throw new InvalidPasswordException();
		}

		const payload = {
			username: credentials.username,
		};

		return this.signSession(payload);
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
			return this.jwtService.verify(token);
		} catch {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
	}
}

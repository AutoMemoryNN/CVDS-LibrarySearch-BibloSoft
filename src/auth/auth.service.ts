import { LoginDto } from '@auth/auth.dto';
import {
	InvalidPasswordException,
	UserNotFoundException,
} from '@auth/auth.exceptions';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

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

		return this.jwtService.sign(payload);
	}
}

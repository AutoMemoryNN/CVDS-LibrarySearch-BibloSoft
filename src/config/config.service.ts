import type { JwtModuleOptions } from '@nestjs/jwt';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
	private readonly jwt: Readonly<JwtModuleOptions>;
	private readonly env: Readonly<NodeJS.ProcessEnv>;
	constructor() {
		this.jwt = this.loadJwtOptions();
		this.env = process.env;
	}

	private loadJwtOptions(): Readonly<JwtModuleOptions> {
		return {
			privateKey: process.env.JWT_PRIVATE_KEY,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1d' },
		};
	}

	public getJwtOptions(): Readonly<JwtModuleOptions> {
		return this.jwt;
	}

	public getEnv(key: string): string | null {
		return this.env[key] ?? null;
	}

	public getStrictEnv(key: string): string {
		const value = this.getEnv(key);
		if (value === null) {
			throw new Error(`Missing environment variable: ${key}`);
		}
		return value;
	}
}

import type { JwtModuleOptions } from '@nestjs/jwt';

/**
 * Application configuration options.
 *
 * @property jwt - JWT module options.
 */
interface AppOptions {
	readonly jwt: Readonly<JwtModuleOptions>;
}

/**
 * JWT module options.
 *
 * @property privateKey - Private key used to sign JWT tokens.
 * @property secret - Secret used to sign JWT tokens.
 * @property signOptions - JWT sign options.
 */
const jwt: Readonly<JwtModuleOptions> = {
	privateKey: process.env.JWT_PRIVATE_KEY,
	secret: process.env.JWT_SECRET,
	signOptions: { expiresIn: '1d' },
};

/**
 * Application configuration options.
 */
export const AppConfig: Readonly<AppOptions> = {
	jwt,
};

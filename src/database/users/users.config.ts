import type { DrizzlePostgresConfig } from '@knaadh/nestjs-drizzle-postgres';

import { UserSchema } from '@database/users/users.schema';

/**
 * Class representing the users database configuration.
 */
export class UserDatabaseConfig {
	create(): DrizzlePostgresConfig {
		return {
			postgres: {
				config: {},
				url: process.env.DATABASE_URL || '',
			},
			config: { schema: { ...UserSchema } },
		};
	}
}

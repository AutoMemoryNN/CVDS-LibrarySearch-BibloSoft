import dotenv from 'dotenv';
import expand from 'dotenv-expand';

expand.expand(dotenv.config({ override: false }));

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/database/users/users.schema.ts',
	out: './.drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
	},
});

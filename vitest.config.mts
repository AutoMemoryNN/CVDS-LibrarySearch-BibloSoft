import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/main.ts', 'src/**/types/**'],
			reporter: ['html'],
		},
		setupFiles: ['dotenv/config'],
	},
	plugins: [
		tsconfigPaths(),
		swc.vite({
			module: { type: 'es6' },
		}),
	],
});

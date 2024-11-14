import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/main.ts'],
			reporter: ['html'],
		},
	},
	plugins: [tsconfigPaths()],
});

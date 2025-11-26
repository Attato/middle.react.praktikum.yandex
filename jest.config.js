module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jest-environment-jsdom',
	setupFiles: ['<rootDir>/src/setupTests.ts'],
	testMatch: ['**/*.test.ts'],
};

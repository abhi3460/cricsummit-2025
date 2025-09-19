module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/../../src/**/*.ts',
    '!<rootDir>/../../src/**/*.d.ts',
    '!<rootDir>/../../src/index.ts',
  ],
  coverageDirectory: '<rootDir>/../../coverage/unit',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
};

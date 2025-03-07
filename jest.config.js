module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/static/**',
      '!**/node_modules/**'
    ],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    setupFilesAfterEnv: ['./tests/jest.setup.js']
  };
/**
 * Jest Setup for Integration Tests
 * Configuration for integration test environment
 */

// Suppress console output during integration tests to reduce noise
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeEach(() => {
  // Suppress console output during tests to reduce noise
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterEach(() => {
  // Restore console methods after each test
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

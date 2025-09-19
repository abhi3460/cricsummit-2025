/**
 * Jest Setup for Unit Tests
 * Configuration for unit test environment
 */

// Global test configuration
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  // Suppress console output during tests to reduce noise
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();

  // Reset mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.restoreAllMocks();
});

// Utility to suppress console logs during tests if needed
export const suppressConsoleLogs = () => {
  console.error = jest.fn();
  console.warn = jest.fn();
};

// Utility to restore console logs
export const restoreConsoleLogs = () => {
  console.error = originalError;
  console.warn = originalWarn;
};

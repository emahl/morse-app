import 'react-native-gesture-handler/jestSetup';

// jest-dom matchers are imported in setupFilesAfterEnv so expect is available

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

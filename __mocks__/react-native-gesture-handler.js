/**
 * Mock for react-native-gesture-handler v2
 * Provides stub implementations of Gesture and GestureDetector
 */

const React = require('react');

const Gesture = {
  LongPress: () => ({
    minDuration: jest.fn().mockReturnThis(),
    maxDuration: jest.fn().mockReturnThis(),
    onBegin: jest.fn().mockReturnThis(),
    onEnd: jest.fn().mockReturnThis(),
    onFinalize: jest.fn().mockReturnThis(),
    onStart: jest.fn().mockReturnThis(),
    onUpdate: jest.fn().mockReturnThis(),
    onFail: jest.fn().mockReturnThis(),
    onCancel: jest.fn().mockReturnThis(),
    simultaneousWithExternalGesture: jest.fn().mockReturnThis(),
    enabled: jest.fn().mockReturnThis(),
    shouldCancelWhenOutside: jest.fn().mockReturnThis(),
    runOnJS: jest.fn().mockReturnThis(),
  }),
  Tap: () => ({
    onEnd: jest.fn().mockReturnThis(),
    onStart: jest.fn().mockReturnThis(),
    onBegin: jest.fn().mockReturnThis(),
    onFinalize: jest.fn().mockReturnThis(),
  }),
  Pan: () => ({
    onBegin: jest.fn().mockReturnThis(),
    onEnd: jest.fn().mockReturnThis(),
    onUpdate: jest.fn().mockReturnThis(),
    onFinalize: jest.fn().mockReturnThis(),
  }),
  Simultaneous: jest.fn((...gestures) => gestures[0]),
  Race: jest.fn((...gestures) => gestures[0]),
  Exclusive: jest.fn((...gestures) => gestures[0]),
};

const GestureDetector = ({ children }) => children;

const GestureHandlerRootView = ({ children, style }) =>
  React.createElement('div', { style }, children);

module.exports = {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  State: {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
  },
};

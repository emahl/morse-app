/**
 * Mock for react-native-reanimated v4
 * Returns static values instead of animated values
 */

const React = require('react');

const createMockAnimatedValue = (initialValue) => {
  return {
    value: initialValue,
  };
};

module.exports = {
  // Hooks
  useSharedValue: jest.fn((initialValue) => {
    const value = React.useRef(initialValue);
    return value.current;
  }),
  useAnimatedStyle: jest.fn((callback) => {
    return React.useMemo(() => callback?.(), []);
  }),
  useAnimatedReaction: jest.fn(),
  useDerivedValue: jest.fn((callback) => {
    return React.useMemo(() => callback?.(), []);
  }),

  // Animation functions
  withTiming: jest.fn((targetValue) => targetValue),
  withSpring: jest.fn((targetValue) => targetValue),
  withDelay: jest.fn((delay, animation) => animation),
  withSequence: jest.fn((...animations) => animations[animations.length - 1]),

  // Utility functions
  interpolate: jest.fn((value, inputRange, outputRange) => {
    // Simple linear interpolation
    if (value <= inputRange[0]) return outputRange[0];
    if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];

    const index = inputRange.findIndex((v, i) => v <= value && value <= inputRange[i + 1]);
    if (index === -1) return outputRange[0];

    const segment = (value - inputRange[index]) / (inputRange[index + 1] - inputRange[index]);
    return outputRange[index] + segment * (outputRange[index + 1] - outputRange[index]);
  }),
  Extrapolate: {
    CLAMP: 'clamp',
    EXTEND: 'extend',
    IDENTITY: 'identity',
  },

  // Components — exported at top level so `import Animated from '...'` resolves Animated.View etc.
  View: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })),
  Text: React.forwardRef((props, ref) => React.createElement('span', { ...props, ref })),
  ScrollView: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })),
  FlatList: React.forwardRef((props, ref) => React.createElement('ul', { ...props, ref })),
  Image: React.forwardRef((props, ref) => React.createElement('img', { ...props, ref })),
  createAnimatedComponent: (Component) => Component,

  // Advanced
  runOnJS: jest.fn((fn) => fn),
  runOnUI: jest.fn((fn) => fn),
};

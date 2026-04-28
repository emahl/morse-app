const React = require('react');

const SafeAreaProvider = ({ children }) => children;
const SafeAreaView = ({ children, style }) =>
  React.createElement('div', { style }, children);
const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });

module.exports = {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
  initialWindowMetrics: {
    frame: { x: 0, y: 0, width: 375, height: 812 },
    insets: { top: 44, bottom: 34, left: 0, right: 0 },
  },
};

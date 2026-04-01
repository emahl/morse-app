/**
 * Mock for @expo/vector-icons
 * Returns a simple button component for testing
 */

const React = require('react');
const { Pressable, Text } = require('react-native');

const MockIcon = (props) => {
  const { name, size, color, onPress, children, ...rest } = props;
  return React.createElement(
    Pressable,
    { onPress, ...rest },
    React.createElement(Text, null, children || name || '')
  );
};

const MaterialCommunityIcons = MockIcon;
MaterialCommunityIcons.Button = (props) => {
  const { name, children, onPress, ...rest } = props;
  return React.createElement(
    Pressable,
    { onPress, ...rest },
    React.createElement(Text, null, children || name || '')
  );
};

module.exports = {
  MaterialCommunityIcons,
  Ionicons: MockIcon,
  FontAwesome: MockIcon,
  FontAwesome5: MockIcon,
  Entypo: MockIcon,
  EvilIcons: MockIcon,
  Feather: MockIcon,
  Foundation: MockIcon,
  Octicons: MockIcon,
  SimpleLineIcons: MockIcon,
  Zocial: MockIcon,
};

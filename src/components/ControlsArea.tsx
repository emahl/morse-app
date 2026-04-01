import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMorseStore } from '../store/morseStore';

interface ControlsAreaProps {
  onShowTreePress: () => void;
  onClearPress: () => void;
}

export const ControlsArea: React.FC<ControlsAreaProps> = ({ onShowTreePress, onClearPress }) => {
  const automaticModeEnabled = useMorseStore((state) => state.automaticModeEnabled);
  const toggleAutoMode = useMorseStore((state) => state.toggleAutoMode);

  return (
    <View style={styles.container}>
      <View style={styles.modeSection}>
        <Text
          style={[
            styles.modeLabel,
            { opacity: automaticModeEnabled ? 1 : 0.5 },
          ]}
        >
          Automatic character check
        </Text>
        <Switch
          value={automaticModeEnabled}
          onValueChange={toggleAutoMode}
          style={styles.switch}
        />
      </View>

      <View style={styles.buttonSection}>
        <TreeButton onPress={onShowTreePress} />
        <ClearButton onPress={onClearPress} />
      </View>
    </View>
  );
};

interface TreeButtonProps {
  onPress: () => void;
}

const TreeButton: React.FC<TreeButtonProps> = ({ onPress }) => {
  const showMorseTree = useMorseStore((state) => state.showMorseTree);
  const caption = showMorseTree ? 'Hide tree' : 'Show tree';

  return (
    <View style={styles.buttonWrapper}>
      <MaterialCommunityIcons.Button
        name="eye"
        size={20}
        onPress={onPress}
        backgroundColor="#007AFF"
        color="white"
      >
        {caption}
      </MaterialCommunityIcons.Button>
    </View>
  );
};

interface ClearButtonProps {
  onPress: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onPress }) => {
  return (
    <View style={styles.buttonWrapper}>
      <MaterialCommunityIcons.Button
        name="delete"
        size={20}
        onPress={onPress}
        backgroundColor="#8D0508"
        color="white"
      >
        Clear all text
      </MaterialCommunityIcons.Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modeLabel: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  switch: {
    marginBottom: 10,
  },
  buttonSection: {
    gap: 12,
  },
  buttonWrapper: {
    marginVertical: 4,
  },
});

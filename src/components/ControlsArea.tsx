import React from 'react';
import { StyleSheet, Switch, Text, View, TouchableOpacity } from 'react-native';
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
        <MaterialCommunityIcons
          name="timer-outline"
          size={20}
          color={automaticModeEnabled ? '#FF7A00' : '#666666'}
        />
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
          testID="auto-mode-switch"
          trackColor={{ false: '#333333', true: '#FF7A00' }}
          thumbColor="#FFFFFF"
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
  const caption = showMorseTree ? 'Got it!' : 'Need help?';

  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      <MaterialCommunityIcons name="help-circle-outline" size={20} color="#FF7A00" />
      <Text style={styles.iconButtonLabel}>{caption}</Text>
    </TouchableOpacity>
  );
};

interface ClearButtonProps {
  onPress: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      <MaterialCommunityIcons name="delete" size={20} color="#FF7A00" />
      <Text style={styles.iconButtonLabel}>Clear all text</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#1C1C1C',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2A2A2A',
  },
  modeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeLabel: {
    color: '#8A8A8A',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  switch: {
    marginLeft: 4,
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  iconButtonLabel: {
    fontSize: 10,
    color: '#8A8A8A',
    fontFamily: 'monospace',
    marginTop: 2,
  },
});

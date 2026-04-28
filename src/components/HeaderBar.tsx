import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMorseStore } from '../store/morseStore';

interface HeaderBarProps {
  onBack?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onBack }) => {
  const clearAll = useMorseStore((state) => state.clearAll);
  const showMorseTree = useMorseStore((state) => state.showMorseTree);
  const toggleMorseTree = useMorseStore((state) => state.toggleMorseTree);
  const showSettings = useMorseStore((state) => state.showSettings);
  const toggleSettings = useMorseStore((state) => state.toggleSettings);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} accessibilityLabel="Go back">
            <MaterialCommunityIcons name="arrow-left" size={22} color="#9A9590" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={toggleMorseTree}
          accessibilityLabel={showMorseTree ? 'Hide morse tree' : 'Show morse tree'}
        >
          <MaterialCommunityIcons
            name={showMorseTree ? 'close-circle-outline' : 'help-circle-outline'}
            size={24}
            color={showMorseTree ? '#E8806A' : '#9A9590'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          onPress={toggleSettings}
          accessibilityLabel={showSettings ? 'Close settings' : 'Open settings'}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={22}
            color={showSettings ? '#E8806A' : '#9A9590'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={clearAll}
          accessibilityLabel="Clear all text"
          style={styles.clearBtn}
        >
          <MaterialCommunityIcons name="delete-outline" size={22} color="#9A9590" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#3E3B38',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#4A4744',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearBtn: {
    paddingLeft: 4,
  },
});

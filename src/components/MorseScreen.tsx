import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useMorseStore } from '../store/morseStore';
import { TextDisplayArea } from './TextDisplayArea';
import { ControlsArea } from './ControlsArea';
import { TapZone } from './TapZone';

export const MorseScreen: React.FC = () => {
  const automaticModeEnabled = useMorseStore((state) => state.automaticModeEnabled);
  const morseSequence = useMorseStore((state) => state.morseSequence);
  const commitCharacter = useMorseStore((state) => state.commitCharacter);
  const insertSpace = useMorseStore((state) => state.insertSpace);
  const toggleMorseTree = useMorseStore((state) => state.toggleMorseTree);
  const clearAll = useMorseStore((state) => state.clearAll);

  const handleTextAreaPress = () => {
    if (!automaticModeEnabled) {
      if (morseSequence.length === 0) {
        insertSpace();
      } else {
        commitCharacter();
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextDisplayArea onTextAreaPress={handleTextAreaPress} />
      <ControlsArea
        onShowTreePress={toggleMorseTree}
        onClearPress={clearAll}
      />
      <TapZone />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0A0A0A',
  },
});

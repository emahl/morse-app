import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMorseStore } from '../store/morseStore';
import { useNavigationStore } from '../store/navigationStore';
import { HeaderBar } from './HeaderBar';
import { TextDisplayArea } from './TextDisplayArea';
import { TapZone } from './TapZone';
import { MorseTreeOverlay } from './MorseTreeOverlay';
import { SettingsOverlay } from './SettingsOverlay';

export const MorseScreen: React.FC = () => {
  const automaticModeEnabled = useMorseStore((state) => state.automaticModeEnabled);
  const morseSequence = useMorseStore((state) => state.morseSequence);
  const commitCharacter = useMorseStore((state) => state.commitCharacter);
  const insertSpace = useMorseStore((state) => state.insertSpace);
  const showMorseTree = useMorseStore((state) => state.showMorseTree);
  const showSettings = useMorseStore((state) => state.showSettings);
  const navigateTo = useNavigationStore((state) => state.navigateTo);

  // Pressing the text area:
  // - If sequence is empty: insert a space (works in both modes; guarded in store)
  // - If sequence has items and NOT in auto mode: commit the character
  const handleTextAreaPress = () => {
    if (morseSequence.length === 0) {
      insertSpace();
    } else if (!automaticModeEnabled) {
      commitCharacter();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar onBack={() => navigateTo('menu')} />
      <MorseTreeOverlay visible={showMorseTree} />
      <SettingsOverlay visible={showSettings} />
      <TextDisplayArea onTextAreaPress={handleTextAreaPress} />
      <TapZone />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#2C2B28',
    overflow: 'hidden',
  },
});

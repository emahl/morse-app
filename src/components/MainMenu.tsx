import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigationStore } from '../store/navigationStore';
import { useEducationalStore } from '../store/educationalStore';

const MORSE_DECORATION = '· − · −  · −  · ·  ·';

export const MainMenu: React.FC = () => {
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const skillLevel = useEducationalStore((s) => s.skillLevel);

  const handleLearnPress = () => {
    // First time: ask about skill level. After that: go straight to levels.
    navigateTo(skillLevel === null ? 'skill-select' : 'level-select');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleArea}>
        <Text style={styles.decoration}>{MORSE_DECORATION}</Text>
        <Text style={styles.title}>MORSE</Text>
        <Text style={styles.title}>CODE</Text>
        <Text style={styles.decoration}>{MORSE_DECORATION}</Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity
          style={styles.freeCard}
          onPress={() => navigateTo('free')}
          accessibilityLabel="Free mode"
        >
          <Text style={styles.cardTitle}>FREE MODE</Text>
          <Text style={styles.cardSubtitle}>
            Tap freely — dit · and dah −{'\n'}no rules, just morse
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.learnCard}
          onPress={handleLearnPress}
          accessibilityLabel="Learn morse code"
        >
          <Text style={styles.learnCardTitle}>LEARN MORSE CODE</Text>
          <Text style={styles.learnCardSubtitle}>
            Guided levels — recognise signals{'\n'}and send morse yourself
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2B28',
    justifyContent: 'center',
    padding: 24,
    gap: 48,
  },
  titleArea: {
    alignItems: 'center',
    gap: 8,
  },
  decoration: {
    fontSize: 14,
    color: 'rgba(232, 128, 106, 0.3)',
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
    letterSpacing: 12,
    lineHeight: 52,
  },
  cards: {
    gap: 16,
  },
  freeCard: {
    backgroundColor: '#E8806A',
    borderRadius: 16,
    padding: 24,
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C2B28',
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(44, 43, 40, 0.7)',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  learnCard: {
    backgroundColor: '#373532',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4A4744',
    padding: 24,
    gap: 8,
  },
  learnCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  learnCardSubtitle: {
    fontSize: 13,
    color: '#9A9590',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});

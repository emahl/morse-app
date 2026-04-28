import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LessonChallenge, sequenceToDisplay } from '../../data/levels';
import { MorsePlayback } from './MorsePlayback';

interface Props {
  challenge: LessonChallenge;
}

export const LessonCard: React.FC<Props> = ({ challenge }) => {
  return (
    <View style={styles.container}>
      <View style={styles.newBadge}>
        <Text style={styles.newBadgeText}>NEW</Text>
      </View>

      <View style={styles.characterBlock}>
        <Text style={styles.character}>{challenge.character}</Text>
        <Text style={styles.morseText}>{sequenceToDisplay(challenge.sequence)}</Text>
        <Text style={styles.description}>{challenge.description}</Text>
      </View>

      <MorsePlayback sequence={challenge.sequence} autoPlay={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  newBadge: {
    backgroundColor: 'rgba(232, 128, 106, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 128, 106, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E8806A',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  characterBlock: {
    alignItems: 'center',
    gap: 10,
  },
  character: {
    fontSize: 96,
    fontWeight: '700',
    color: '#E8806A',
    fontFamily: 'monospace',
    lineHeight: 110,
  },
  morseText: {
    fontSize: 28,
    color: '#F5F3EF',
    fontFamily: 'monospace',
    letterSpacing: 8,
  },
  description: {
    fontSize: 14,
    color: '#9A9590',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});

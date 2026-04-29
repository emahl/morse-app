import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AudioCopyChallenge as ACChallenge } from '../../data/levels';
import { useEducationalStore } from '../../store/educationalStore';
import { useMorseStore } from '../../store/morseStore';
import { TAPTYPE_DIT, DIT_DURATION, DAH_DURATION } from '../../utility/constants';
import { playDitTone, playDahTone } from '../../utility/morseAudio';

const INTER_SYMBOL_GAP = 150; // ms

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface Props {
  challenge: ACChallenge;
}

export const AudioCopyChallenge: React.FC<Props> = ({ challenge }) => {
  const submitAnswer = useEducationalStore((s) => s.submitAnswer);
  const lastResult = useEducationalStore((s) => s.lastResult);
  const selectedAnswer = useEducationalStore((s) => s.selectedAnswer);

  const audioEnabled = useMorseStore((s) => s.audioEnabled);
  const hapticsEnabled = useMorseStore((s) => s.hapticsEnabled);

  const shuffledOptions = React.useMemo(
    () => [...challenge.options].sort(() => Math.random() - 0.5),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const cancelRef = useRef(false);
  const answered = lastResult !== null;

  const play = useCallback(async () => {
    if (isPlaying) return;
    cancelRef.current = false;
    setIsPlaying(true);

    for (let i = 0; i < challenge.sequence.length; i++) {
      if (cancelRef.current) break;
      const isDit = challenge.sequence[i] === TAPTYPE_DIT;

      if (audioEnabled) (isDit ? playDitTone : playDahTone)().catch(() => {});
      if (hapticsEnabled)
        Haptics.impactAsync(isDit ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      await delay(isDit ? DIT_DURATION : DAH_DURATION);
      if (cancelRef.current) break;
      if (i < challenge.sequence.length - 1) await delay(INTER_SYMBOL_GAP);
    }

    setIsPlaying(false);
  }, [challenge.sequence, audioEnabled, hapticsEnabled, isPlaying]);

  // Auto-play on mount with a short delay
  useEffect(() => {
    const t = setTimeout(() => play(), 600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { cancelRef.current = true; };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What did you hear?</Text>
        <Text style={styles.subtitle}>Listen to the morse code — no visual hints!</Text>
      </View>

      {/* Play button */}
      <TouchableOpacity
        style={[styles.playBtn, isPlaying && styles.playBtnActive]}
        onPress={play}
        disabled={isPlaying || answered}
        accessibilityLabel="Play morse code"
      >
        <MaterialCommunityIcons
          name={isPlaying ? 'volume-high' : 'play-circle'}
          size={48}
          color={isPlaying ? '#E8806A' : '#9A9590'}
        />
        <Text style={[styles.playText, isPlaying && styles.playTextActive]}>
          {isPlaying ? 'Playing…' : 'Play again'}
        </Text>
      </TouchableOpacity>

      {/* Options */}
      <View style={styles.options}>
        {shuffledOptions.map((option) => {
          const isCorrect = option === challenge.correctAnswer;
          const isPicked = option === selectedAnswer;

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                answered && lastResult === 'correct' && isCorrect ? styles.optionCorrect : undefined,
                answered && lastResult === 'incorrect' && isPicked ? styles.optionWrong : undefined,
              ]}
              onPress={() => !answered && submitAnswer(option)}
              disabled={answered}
              accessibilityLabel={`Option ${option}`}
            >
              <Text style={[
                styles.optionText,
                answered && lastResult === 'correct' && isCorrect ? styles.optionTextCorrect : undefined,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 28,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#9A9590',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  playBtn: {
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    padding: 16,
  },
  playBtnActive: {
    opacity: 0.8,
  },
  playText: {
    fontSize: 13,
    color: '#9A9590',
    fontFamily: 'monospace',
  },
  playTextActive: {
    color: '#E8806A',
  },
  options: {
    gap: 12,
  },
  option: {
    backgroundColor: '#373532',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A4744',
    paddingVertical: 18,
    alignItems: 'center',
  },
  optionCorrect: {
    backgroundColor: '#2A4A3A',
    borderColor: '#4A9A6A',
  },
  optionWrong: {
    backgroundColor: '#2C2B28',
    borderColor: '#4A4744',
    opacity: 0.45,
  },
  optionText: {
    fontSize: 22,
    color: '#F5F3EF',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  optionTextCorrect: {
    color: '#6ACA8A',
  },
});

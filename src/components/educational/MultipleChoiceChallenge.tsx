import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MultipleChoiceChallenge as MCChallenge, sequenceToDisplay } from '../../data/levels';
import { useEducationalStore } from '../../store/educationalStore';

interface Props {
  challenge: MCChallenge;
}

export const MultipleChoiceChallenge: React.FC<Props> = ({ challenge }) => {
  const submitAnswer = useEducationalStore((s) => s.submitAnswer);
  const lastResult = useEducationalStore((s) => s.lastResult);
  const selectedAnswer = useEducationalStore((s) => s.selectedAnswer);

  // Shuffle once on mount so the correct answer isn't always in the same position.
  // The component remounts on every new challenge (key={currentChallengeIndex} in LevelScreen)
  // so this is stable per challenge but fresh on each new one or after retry.
  const shuffledOptions = useMemo(
    () => [...challenge.options].sort(() => Math.random() - 0.5),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const morseDisplay = challenge.morseSequence ? sequenceToDisplay(challenge.morseSequence) : null;
  const answered = lastResult !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{challenge.instruction}</Text>

      {morseDisplay !== null && (
        <View style={styles.morseBox}>
          <Text style={styles.morseText}>{morseDisplay}</Text>
        </View>
      )}

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
    gap: 24,
  },
  instruction: {
    fontSize: 16,
    color: '#F5F3EF',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 24,
  },
  morseBox: {
    backgroundColor: '#373532',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A4744',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  morseText: {
    fontSize: 28,
    color: '#E8806A',
    fontFamily: 'monospace',
    letterSpacing: 6,
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  option: {
    backgroundColor: '#373532',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A4744',
    paddingVertical: 14,
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
    fontSize: 18,
    color: '#F5F3EF',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#6ACA8A',
  },
});

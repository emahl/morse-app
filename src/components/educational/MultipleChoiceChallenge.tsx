import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MultipleChoiceChallenge as MCChallenge, sequenceToDisplay } from '../../data/levels';
import { useEducationalStore } from '../../store/educationalStore';

interface Props {
  challenge: MCChallenge;
}

export const MultipleChoiceChallenge: React.FC<Props> = ({ challenge }) => {
  const submitAnswer = useEducationalStore((state) => state.submitAnswer);
  const lastResult = useEducationalStore((state) => state.lastResult);
  const selectedAnswer = useEducationalStore((state) => state.selectedAnswer);

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
        {challenge.options.map((option) => {
          const isCorrect = option === challenge.correctAnswer;
          const isPicked = option === selectedAnswer;

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                answered && isCorrect ? styles.optionCorrect : undefined,
                answered && isPicked ? styles.optionWrong : undefined,
              ]}
              onPress={() => !answered && submitAnswer(option)}
              disabled={answered}
              accessibilityLabel={`Option ${option}`}
            >
              <Text style={[styles.optionText, answered && isCorrect ? styles.optionTextCorrect : undefined]}>
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
    backgroundColor: '#4A2A28',
    borderColor: '#9A4A44',
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

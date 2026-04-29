import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WordInputChallenge as WICChallenge, sequenceToDisplay } from '../../data/levels';
import { useEducationalStore } from '../../store/educationalStore';
import { useMorseStore } from '../../store/morseStore';
import { EduTapZone } from './EduTapZone';
import { MorsePlayback } from './MorsePlayback';

interface Props {
  challenge: WICChallenge;
}

export const WordInputChallenge: React.FC<Props> = ({ challenge }) => {
  const currentInput = useEducationalStore((s) => s.currentInput);
  const clearInput = useEducationalStore((s) => s.clearInput);
  const submitMorseInput = useEducationalStore((s) => s.submitMorseInput);
  const lastResult = useEducationalStore((s) => s.lastResult);
  const characterCommitDelay = useMorseStore((s) => s.characterCommitDelay);

  const autoSubmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showHint, setShowHint] = useState(false);

  const fullTargetSequence = challenge.targetCharacters.flatMap((c) => c.sequence);
  const hasInput = currentInput.length > 0;
  const answered = lastResult !== null;

  // Compute how many target characters have been fully tapped so far
  const completedCount = (() => {
    let pos = 0;
    let count = 0;
    for (const { sequence } of challenge.targetCharacters) {
      const slice = currentInput.slice(pos, pos + sequence.length);
      const matches = slice.length === sequence.length && slice.every((v, i) => v === sequence[i]);
      if (matches) { pos += sequence.length; count++; } else break;
    }
    return count;
  })();

  // Auto-submit after inactivity
  useEffect(() => {
    if (answered || !hasInput) return;
    autoSubmitTimer.current = setTimeout(submitMorseInput, characterCommitDelay);
    return () => { if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current); };
  }, [currentInput, answered]); // eslint-disable-line react-hooks/exhaustive-deps

  // Answer reference shown after correct/incorrect
  const targetDisplay = challenge.targetCharacters
    .map((c) => sequenceToDisplay(c.sequence))
    .join('   ');

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{challenge.instruction}</Text>

      {/* Character reference cards */}
      <View style={styles.referenceRow}>
        {challenge.targetCharacters.map(({ char, sequence }, i) => {
          const isDone = i < completedCount;
          return (
            <View key={char} style={[styles.charCard, isDone && styles.charCardDone]}>
              <Text style={[styles.charLetter, isDone && styles.charLetterDone]}>{char}</Text>
              <Text style={[styles.charMorse, isDone && styles.charMorseDone]}>
                {sequenceToDisplay(sequence)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Input display */}
      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>Your input</Text>
        <Text style={[styles.inputDisplay, !hasInput && styles.inputEmpty]}>
          {hasInput ? sequenceToDisplay(currentInput) : '—'}
        </Text>
        {answered && (
          <Text style={styles.answerHint}>{targetDisplay}</Text>
        )}
      </View>

      {/* Hint toggle */}
      {!answered && (
        <TouchableOpacity
          style={styles.hintToggle}
          onPress={() => setShowHint((s) => !s)}
          accessibilityLabel={showHint ? 'Hide hint' : 'Show hint'}
        >
          <Text style={styles.hintToggleText}>
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </Text>
        </TouchableOpacity>
      )}

      {showHint && !answered && (
        <View style={styles.hintCard}>
          <Text style={styles.hintLabel}>Full sequence for  {challenge.targetWord}</Text>
          <MorsePlayback sequence={fullTargetSequence} autoPlay={false} />
        </View>
      )}

      <EduTapZone />

      {!answered && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={clearInput}
            disabled={!hasInput}
            accessibilityLabel="Clear input"
          >
            <Text style={[styles.clearText, !hasInput && styles.disabledText]}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitBtn, !hasInput && styles.submitBtnDisabled]}
            onPress={submitMorseInput}
            disabled={!hasInput}
            accessibilityLabel="Submit answer"
          >
            <Text style={[styles.submitText, !hasInput && styles.disabledText]}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  instruction: {
    fontSize: 16,
    color: '#F5F3EF',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 24,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  charCard: {
    flex: 1,
    backgroundColor: '#373532',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A4744',
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  charCardDone: {
    backgroundColor: 'rgba(232, 128, 106, 0.12)',
    borderColor: 'rgba(232, 128, 106, 0.5)',
  },
  charLetter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9A9590',
    fontFamily: 'monospace',
  },
  charLetterDone: {
    color: '#E8806A',
  },
  charMorse: {
    fontSize: 14,
    color: '#4A4744',
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
  charMorseDone: {
    color: '#E8806A',
  },
  inputBox: {
    backgroundColor: '#373532',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A4744',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    color: '#9A9590',
    fontFamily: 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputDisplay: {
    fontSize: 22,
    color: '#E8806A',
    fontFamily: 'monospace',
    letterSpacing: 5,
    marginTop: 4,
  },
  inputEmpty: {
    color: '#4A4744',
  },
  answerHint: {
    fontSize: 13,
    color: '#9A9590',
    fontFamily: 'monospace',
    marginTop: 6,
    letterSpacing: 4,
  },
  hintToggle: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  hintToggleText: {
    fontSize: 13,
    color: 'rgba(232, 128, 106, 0.6)',
    fontFamily: 'monospace',
    textDecorationLine: 'underline',
  },
  hintCard: {
    backgroundColor: 'rgba(232, 128, 106, 0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 128, 106, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  hintLabel: {
    fontSize: 13,
    color: '#9A9590',
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#373532',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A4744',
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 16,
    color: '#F5F3EF',
    fontFamily: 'monospace',
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#E8806A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#373532',
    borderWidth: 1,
    borderColor: '#4A4744',
  },
  submitText: {
    fontSize: 16,
    color: '#2C2B28',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  disabledText: {
    color: '#4A4744',
  },
});

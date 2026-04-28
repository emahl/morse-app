import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MorseInputChallenge as MICChallenge, sequenceToDisplay } from '../../data/levels';
import { useEducationalStore } from '../../store/educationalStore';
import { useMorseStore } from '../../store/morseStore';
import { EduTapZone } from './EduTapZone';
import { TAPTYPE_DIT } from '../../utility/constants';

interface Props {
  challenge: MICChallenge;
}

export const MorseInputChallenge: React.FC<Props> = ({ challenge }) => {
  const currentInput = useEducationalStore((state) => state.currentInput);
  const clearInput = useEducationalStore((state) => state.clearInput);
  const submitMorseInput = useEducationalStore((state) => state.submitMorseInput);
  const lastResult = useEducationalStore((state) => state.lastResult);
  const characterCommitDelay = useMorseStore((state) => state.characterCommitDelay);

  const autoSubmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputDisplay = currentInput.length > 0 ? sequenceToDisplay(currentInput) : '—';
  const hasInput = currentInput.length > 0;
  const answered = lastResult !== null;

  const hint = challenge.targetSequence
    .map((t) => (t === TAPTYPE_DIT ? '·' : '−'))
    .join(' ');

  // Auto-submit after inactivity — resets on each new tap
  useEffect(() => {
    if (answered || !hasInput) return;
    autoSubmitTimer.current = setTimeout(submitMorseInput, characterCommitDelay);
    return () => {
      if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
    };
  }, [currentInput, answered]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{challenge.instruction}</Text>

      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>Your input</Text>
        <Text style={[styles.inputDisplay, !hasInput && styles.inputEmpty]}>
          {inputDisplay}
        </Text>
        {answered && (
          <Text style={styles.hint}>Answer: {hint}</Text>
        )}
      </View>

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
    gap: 16,
  },
  instruction: {
    fontSize: 18,
    color: '#F5F3EF',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 26,
  },
  inputBox: {
    backgroundColor: '#373532',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A4744',
    paddingVertical: 16,
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
    fontSize: 32,
    color: '#E8806A',
    fontFamily: 'monospace',
    letterSpacing: 8,
    marginTop: 4,
  },
  inputEmpty: {
    color: '#4A4744',
  },
  hint: {
    fontSize: 13,
    color: '#9A9590',
    fontFamily: 'monospace',
    marginTop: 6,
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

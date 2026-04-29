import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useMorseStore } from '../store/morseStore';
import { TAPTYPE_DIT, TAPTYPE_DAH, DIT_DURATION, DAH_DURATION } from '../utility/constants';
import { playDitTone, playDahTone } from '../utility/morseAudio';
import { usePressInput } from '../hooks/usePressInput';

export const TapZone: React.FC = () => {
  const automaticModeEnabled = useMorseStore((state) => state.automaticModeEnabled);
  const pressDurationThreshold = useMorseStore((state) => state.pressDurationThreshold);
  const characterCommitDelay = useMorseStore((state) => state.characterCommitDelay);
  const audioEnabled = useMorseStore((state) => state.audioEnabled);
  const hapticsEnabled = useMorseStore((state) => state.hapticsEnabled);
  const addTap = useMorseStore((state) => state.addTap);
  const commitCharacter = useMorseStore((state) => state.commitCharacter);
  const setDitDahText = useMorseStore((state) => state.setDitDahText);
  const clearDitDahText = useMorseStore((state) => state.clearDitDahText);

  const autoCommitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelCommitTimer = () => {
    if (autoCommitTimer.current) {
      clearTimeout(autoCommitTimer.current);
      autoCommitTimer.current = null;
    }
  };

  const scheduleAutoCommit = () => {
    cancelCommitTimer();
    autoCommitTimer.current = setTimeout(() => {
      autoCommitTimer.current = null;
      commitCharacter();
    }, characterCommitDelay);
  };

  const performDit = async () => {
    setDitDahText('dit');
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(console.error);
    if (audioEnabled) await playDitTone();
    addTap(TAPTYPE_DIT);
    setTimeout(() => clearDitDahText(), DIT_DURATION);
  };

  const performDah = async () => {
    setDitDahText('dah');
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(console.error);
    if (audioEnabled) await playDahTone();
    addTap(TAPTYPE_DAH);
    setTimeout(() => clearDitDahText(), DAH_DURATION);
  };

  const { gesture, scaleStyle, rippleStyle } = usePressInput({
    pressDurationThreshold,
    onPressStart: cancelCommitTimer,
    onPressEnd: (type) => {
      if (type === TAPTYPE_DIT) {
        performDit().catch(console.error);
      } else {
        performDah().catch(console.error);
      }
      if (automaticModeEnabled) scheduleAutoCommit();
    },
  });

  useEffect(() => {
    return () => cancelCommitTimer();
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, scaleStyle]} testID="tap-zone">
        <View style={styles.content}>
          <View style={styles.circle}>
            <Animated.View style={[styles.ripple, rippleStyle]} pointerEvents="none" />
            <Text style={styles.pressLabel}>PRESS</Text>
          </View>
          <Text style={styles.hint}>· tap  ─  hold</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2B28',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 128, 106, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#E8806A',
    left: -50,
    top: -50,
  },
  pressLabel: {
    fontSize: 32,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#E8806A',
    letterSpacing: 6,
    opacity: 0.9,
  },
  hint: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#9A9590',
    letterSpacing: 3,
  },
});

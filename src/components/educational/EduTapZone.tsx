import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useMorseStore } from '../../store/morseStore';
import { useEducationalStore } from '../../store/educationalStore';
import { TAPTYPE_DIT, DIT_DURATION, DAH_DURATION } from '../../utility/constants';
import { playDitTone, playDahTone } from '../../utility/morseAudio';
import { usePressInput } from '../../hooks/usePressInput';

export const EduTapZone: React.FC = () => {
  const pressDurationThreshold = useMorseStore((state) => state.pressDurationThreshold);
  const audioEnabled = useMorseStore((state) => state.audioEnabled);
  const hapticsEnabled = useMorseStore((state) => state.hapticsEnabled);
  const addInputTap = useEducationalStore((state) => state.addInputTap);

  const [feedbackSymbol, setFeedbackSymbol] = useState('');
  const feedbackOpacity = useSharedValue(0);

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }));

  const { gesture, scaleStyle, rippleStyle } = usePressInput({
    pressDurationThreshold,
    onPressEnd: (type) => {
      const isDit = type === TAPTYPE_DIT;
      if (hapticsEnabled)
        Haptics.impactAsync(isDit ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium)
          .catch(console.error);
      if (audioEnabled) (isDit ? playDitTone : playDahTone)().catch(console.error);

      setFeedbackSymbol(isDit ? '·' : '−');
      feedbackOpacity.value = 0.9;
      feedbackOpacity.value = withTiming(0, { duration: isDit ? DIT_DURATION : DAH_DURATION });

      addInputTap(type);
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, scaleStyle]} testID="edu-tap-zone">
        <View style={styles.circle}>
          <Animated.View style={[styles.ripple, rippleStyle]} pointerEvents="none" />
          <Text style={styles.pressLabel}>PRESS</Text>
          <Animated.Text style={[styles.feedbackText, feedbackStyle]} pointerEvents="none">
            {feedbackSymbol}
          </Animated.Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2B28',
    overflow: 'hidden',
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 128, 106, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#E8806A',
    left: -50,
    top: -50,
  },
  pressLabel: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#E8806A',
    letterSpacing: 4,
    opacity: 0.9,
  },
  feedbackText: {
    position: 'absolute',
    fontSize: 40,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#F5F3EF',
  },
});

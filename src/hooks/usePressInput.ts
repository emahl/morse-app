import { useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TapType, TAPTYPE_DIT, TAPTYPE_DAH } from '../utility/constants';

interface UsePressInputOptions {
  pressDurationThreshold: number;
  onPressStart?: () => void;
  onPressEnd: (type: TapType) => void;
}

export function usePressInput({ pressDurationThreshold, onPressStart, onPressEnd }: UsePressInputOptions) {
  const pressStartTime = useRef<number>(0);
  const scale = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const handleStart = () => {
    pressStartTime.current = Date.now();
    scale.value = withTiming(0.97, { duration: 80 });
    rippleScale.value = 0;
    rippleOpacity.value = 0.6;
    rippleScale.value = withTiming(1, { duration: 500 });
    rippleOpacity.value = withTiming(0, { duration: 500 });
    onPressStart?.();
  };

  const handleEnd = () => {
    const duration = Date.now() - pressStartTime.current;
    scale.value = withTiming(1, { duration: 80 });
    onPressEnd(duration <= pressDurationThreshold ? TAPTYPE_DIT : TAPTYPE_DAH);
  };

  const gesture = Gesture.LongPress()
    .minDuration(0)
    .runOnJS(true)
    .onStart(() => handleStart())
    .onFinalize(() => handleEnd());

  return { gesture, scaleStyle, rippleStyle };
}

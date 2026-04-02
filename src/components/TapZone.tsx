import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMorseStore } from '../store/morseStore';
import { TAPTYPE_DIT, TAPTYPE_DAH, PRESS_DURATION_THRESHOLD, DIT_DURATION, DAH_DURATION, CHARACTER_DELAY_DURATION } from '../utility/constants';
import { playDitTone, playDahTone } from '../utility/morseAudio';

export const TapZone: React.FC = () => {
  const showMorseTree = useMorseStore((state) => state.showMorseTree);
  const automaticModeEnabled = useMorseStore((state) => state.automaticModeEnabled);
  const addTap = useMorseStore((state) => state.addTap);
  const commitCharacter = useMorseStore((state) => state.commitCharacter);
  const setDitDahText = useMorseStore((state) => state.setDitDahText);
  const clearDitDahText = useMorseStore((state) => state.clearDitDahText);

  const pressStartTime = useRef<number>(0);
  const autoCommitTimer = useRef<NodeJS.Timeout | null>(null);

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

  const handlePressStart = () => {
    pressStartTime.current = Date.now();

    // Clear any pending auto-commit timer
    if (autoCommitTimer.current) {
      clearTimeout(autoCommitTimer.current);
    }

    scale.value = withTiming(0.95, { duration: 100 });

    // Start ripple animation
    rippleScale.value = 0;
    rippleOpacity.value = 0.5;
    rippleScale.value = withTiming(1, { duration: 450 });
    rippleOpacity.value = withTiming(0, { duration: 450 });
  };

  const handlePressEnd = () => {
    const pressDuration = Date.now() - pressStartTime.current;
    const isDit = pressDuration <= PRESS_DURATION_THRESHOLD;

    scale.value = withTiming(1, { duration: 100 });

    if (isDit) {
      performDit();
    } else {
      performDah();
    }

    // Set up auto-commit if in automatic mode
    if (automaticModeEnabled) {
      scheduleAutoCommit();
    }
  };

  const performDit = async () => {
    setDitDahText('dit');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await playDitTone();
    addTap(TAPTYPE_DIT);

    setTimeout(() => {
      clearDitDahText();
    }, DIT_DURATION);
  };

  const performDah = async () => {
    setDitDahText('dah');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await playDahTone();
    addTap(TAPTYPE_DAH);

    setTimeout(() => {
      clearDitDahText();
    }, DAH_DURATION);
  };

  const scheduleAutoCommit = () => {
    if (autoCommitTimer.current) {
      clearTimeout(autoCommitTimer.current);
    }

    autoCommitTimer.current = setTimeout(() => {
      commitCharacter();
    }, CHARACTER_DELAY_DURATION);
  };

  useEffect(() => {
    return () => {
      if (autoCommitTimer.current) {
        clearTimeout(autoCommitTimer.current);
      }
    };
  }, []);

  const longPressGesture = Gesture.LongPress()
    .minDuration(0) // Start immediately on press
    .onStart(() => {
      handlePressStart();
    })
    .onFinalize(() => {
      handlePressEnd();
    });

  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View style={[styles.container, scaleStyle]} testID="tap-zone">
        <View style={styles.content}>
          <Animated.View style={[styles.ripple, rippleStyle]} pointerEvents="none" />
          <MaterialCommunityIcons
            name="pan-right"
            size={48}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.label}>press</Text>

          {showMorseTree && (
            <Image
              source={require('../../assets/morse-tree.png')}
              style={styles.treeImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  ripple: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FF7A00',
    alignSelf: 'center',
    top: '50%',
    marginTop: -150,
  },
  icon: {
    opacity: 0.2,
    marginBottom: 8,
  },
  label: {
    fontSize: 28,
    fontFamily: 'monospace',
    color: '#FF7A00',
    opacity: 0.4,
  },
  treeImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    marginTop: 16,
    opacity: 0.7,
  },
});

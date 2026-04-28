import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import { useMorseStore } from '../store/morseStore';

interface TextDisplayAreaProps {
  onTextAreaPress: () => void;
}

export const TextDisplayArea: React.FC<TextDisplayAreaProps> = ({ onTextAreaPress }) => {
  const text = useMorseStore((state) => state.text);
  const currentCharacter = useMorseStore((state) => state.currentCharacter);
  const ditDahText = useMorseStore((state) => state.ditDahText);

  const backgroundAnim = useSharedValue(300);
  const fadeAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);

  // Trigger animations when ditDahText changes
  useEffect(() => {
    if (ditDahText) {
      // Animate in: fade to opaque, background flashes, glow pulses
      backgroundAnim.value = withTiming(0, { duration: ditDahText === 'dit' ? 150 : 300 });
      fadeAnim.value = withTiming(1, { duration: 50 });
      glowAnim.value = withTiming(1, { duration: 80 });

      // Animate out after the press duration
      const duration = ditDahText === 'dit' ? 150 : 300;
      const timeoutId = setTimeout(() => {
        fadeAnim.value = withTiming(0, { duration: 100 });
        backgroundAnim.value = withTiming(300, { duration: 100 });
        glowAnim.value = withTiming(0, { duration: 150 });
      }, duration);

      return () => clearTimeout(timeoutId);
    }
  }, [ditDahText, backgroundAnim, fadeAnim, glowAnim]);

  const backgroundStyle = useAnimatedStyle(() => {
    const alpha = interpolate(
      backgroundAnim.value,
      [0, 300],
      [0.35, 0], // Orange flash fades to transparent at rest
      Extrapolate.CLAMP
    );

    return {
      backgroundColor: `rgba(232, 128, 106, ${alpha})`,
    };
  });

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    textShadowColor: '#E8806A',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: interpolate(glowAnim.value, [0, 1], [0, 18], Extrapolate.CLAMP),
  }));

  return (
    <TouchableWithoutFeedback onPress={onTextAreaPress}>
      <View style={styles.container}>
        <Animated.Text style={[styles.currentCharacter, glowStyle]} testID="current-character">{currentCharacter}</Animated.Text>
        <Text style={styles.text} testID="accumulated-text">{text}</Text>

        <Animated.View style={[styles.ditDahOverlay, backgroundStyle]} pointerEvents="none">
          <Animated.Text style={[styles.ditDahText, fadeStyle]} testID="dit-dah-text">
            {ditDahText}
          </Animated.Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#373532',
    paddingVertical: 16,
  },
  currentCharacter: {
    fontSize: 56,
    fontWeight: '700',
    color: '#F5F3EF',
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    fontFamily: 'monospace',
    textAlign: 'center',
    paddingHorizontal: 16,
    color: '#C8C3BE',
  },
  ditDahOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ditDahText: {
    fontSize: 64,
    fontFamily: 'monospace',
    color: '#E8806A',
  },
});

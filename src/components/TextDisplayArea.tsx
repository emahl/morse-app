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

  // Trigger animations when ditDahText changes
  useEffect(() => {
    if (ditDahText) {
      // Animate in: fade to opaque, background flashes
      backgroundAnim.value = withTiming(0, { duration: ditDahText === 'dit' ? 150 : 300 });
      fadeAnim.value = withTiming(1, { duration: 50 });

      // Animate out after the press duration
      const duration = ditDahText === 'dit' ? 150 : 300;
      const timeoutId = setTimeout(() => {
        fadeAnim.value = withTiming(0, { duration: 100 });
        backgroundAnim.value = withTiming(300, { duration: 100 });
      }, duration);

      return () => clearTimeout(timeoutId);
    }
  }, [ditDahText, backgroundAnim, fadeAnim]);

  const backgroundStyle = useAnimatedStyle(() => {
    const color = interpolate(
      backgroundAnim.value,
      [0, 300],
      [0.5, 0], // Green flash fades to transparent at rest
      Extrapolate.CLAMP
    );

    return {
      backgroundColor: `rgba(245, 252, 255, ${color})`,
    };
  });

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={onTextAreaPress}>
      <View style={styles.container}>
        <Text style={styles.currentCharacter} testID="current-character">{currentCharacter}</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  currentCharacter: {
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    fontFamily: 'monospace',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  ditDahOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ditDahText: {
    fontSize: 64,
    fontFamily: 'monospace',
    opacity: 0.4,
  },
});

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMorseStore } from '../../store/morseStore';
import { TAPTYPE_DIT, TapType, DIT_DURATION, DAH_DURATION } from '../../utility/constants';
import { playDitTone, playDahTone } from '../../utility/morseAudio';

const INTER_SYMBOL_GAP = 150; // ms pause between symbols

interface MorsePlaybackProps {
  sequence: TapType[];
  autoPlay?: boolean;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const MorsePlayback: React.FC<MorsePlaybackProps> = ({ sequence, autoPlay = false }) => {
  const audioEnabled = useMorseStore((s) => s.audioEnabled);
  const hapticsEnabled = useMorseStore((s) => s.hapticsEnabled);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const cancelRef = useRef(false);

  const play = useCallback(async () => {
    if (isPlaying) return;
    cancelRef.current = false;
    setIsPlaying(true);

    for (let i = 0; i < sequence.length; i++) {
      if (cancelRef.current) break;
      const isDit = sequence[i] === TAPTYPE_DIT;
      setActiveIndex(i);

      if (audioEnabled) {
        (isDit ? playDitTone : playDahTone)().catch(() => {});
      }
      if (hapticsEnabled) {
        Haptics.impactAsync(
          isDit ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium,
        ).catch(() => {});
      }

      await delay(isDit ? DIT_DURATION : DAH_DURATION);
      if (cancelRef.current) break;
      setActiveIndex(-1);
      if (i < sequence.length - 1) await delay(INTER_SYMBOL_GAP);
    }

    setActiveIndex(-1);
    setIsPlaying(false);
  }, [sequence, audioEnabled, hapticsEnabled, isPlaying]);

  useEffect(() => {
    if (autoPlay) {
      // Small delay so the card finishes rendering before playing
      const t = setTimeout(() => play(), 400);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.symbolRow}>
        {sequence.map((tap, i) => {
          const isDit = tap === TAPTYPE_DIT;
          const isActive = i === activeIndex;
          return (
            <View
              key={i}
              style={[
                isDit ? styles.dot : styles.dash,
                isActive && styles.symbolActive,
              ]}
            />
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.playBtn, isPlaying && styles.playBtnActive]}
        onPress={play}
        disabled={isPlaying}
        accessibilityLabel="Play morse code"
      >
        <MaterialCommunityIcons
          name={isPlaying ? 'volume-high' : 'play-circle-outline'}
          size={20}
          color={isPlaying ? '#E8806A' : '#9A9590'}
        />
        <Text style={[styles.playBtnText, isPlaying && styles.playBtnTextActive]}>
          {isPlaying ? 'Playing…' : 'Play again'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  symbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 24,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4A4744',
  },
  dash: {
    width: 32,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4A4744',
  },
  symbolActive: {
    backgroundColor: '#E8806A',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4A4744',
    backgroundColor: '#373532',
  },
  playBtnActive: {
    borderColor: 'rgba(232, 128, 106, 0.4)',
  },
  playBtnText: {
    fontSize: 13,
    color: '#9A9590',
    fontFamily: 'monospace',
  },
  playBtnTextActive: {
    color: '#E8806A',
  },
});

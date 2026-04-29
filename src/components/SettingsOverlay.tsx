import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMorseStore } from '../store/morseStore';

const PANEL_HEIGHT = 320;

const Toggle: React.FC<{ value: boolean; onPress: () => void; testID?: string }> = ({ value, onPress, testID }) => {
  const translateX = useSharedValue(value ? 18 : 2);

  React.useEffect(() => {
    translateX.value = withTiming(value ? 18 : 2, { duration: 180 });
  }, [value, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.track, { backgroundColor: value ? '#E8806A' : '#4A4744' }]}
    >
      <Animated.View style={[styles.thumb, thumbStyle]} />
    </TouchableOpacity>
  );
};

const ToggleRow: React.FC<{ label: string; sublabel?: string; value: boolean; onPress: () => void; testID?: string }> = ({
  label, sublabel, value, onPress, testID,
}) => (
  <View style={styles.row}>
    <View style={styles.rowLabel}>
      <Text style={styles.label}>{label}</Text>
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
    </View>
    <Toggle value={value} onPress={onPress} testID={testID} />
  </View>
);

const StepperRow: React.FC<{
  label: string;
  sublabel?: string;
  value: number;
  unit: string;
  step: number;
  min: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
}> = ({ label, sublabel, value, unit, step, min, max, onDecrement, onIncrement }) => (
  <View style={styles.row}>
    <View style={styles.rowLabel}>
      <Text style={styles.label}>{label}</Text>
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
    </View>
    <View style={styles.stepper}>
      <TouchableOpacity
        onPress={onDecrement}
        disabled={value <= min}
        style={[styles.stepBtn, value <= min && styles.stepBtnDisabled]}
      >
        <MaterialCommunityIcons name="minus" size={16} color={value <= min ? '#4A4744' : '#F5F3EF'} />
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}{unit}</Text>
      <TouchableOpacity
        onPress={onIncrement}
        disabled={value >= max}
        style={[styles.stepBtn, value >= max && styles.stepBtnDisabled]}
      >
        <MaterialCommunityIcons name="plus" size={16} color={value >= max ? '#4A4744' : '#F5F3EF'} />
      </TouchableOpacity>
    </View>
  </View>
);

interface SettingsOverlayProps {
  visible: boolean;
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ visible }) => {
  const automaticModeEnabled = useMorseStore((state) => state.automaticModeEnabled);
  const pressDurationThreshold = useMorseStore((state) => state.pressDurationThreshold);
  const characterCommitDelay = useMorseStore((state) => state.characterCommitDelay);
  const audioEnabled = useMorseStore((state) => state.audioEnabled);
  const hapticsEnabled = useMorseStore((state) => state.hapticsEnabled);

  const toggleAutoMode = useMorseStore((state) => state.toggleAutoMode);
  const setPressDurationThreshold = useMorseStore((state) => state.setPressDurationThreshold);
  const setCharacterCommitDelay = useMorseStore((state) => state.setCharacterCommitDelay);
  const toggleAudio = useMorseStore((state) => state.toggleAudio);
  const toggleHaptics = useMorseStore((state) => state.toggleHaptics);

  const heightAnim = useSharedValue(0);

  React.useEffect(() => {
    heightAnim.value = withTiming(visible ? PANEL_HEIGHT : 0, { duration: 280 });
  }, [visible, heightAnim]);

  const wrapperStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
    overflow: 'hidden',
  }));

  return (
    <Animated.View style={wrapperStyle}>
      <View style={styles.card}>
        <Text style={styles.header}>Settings</Text>

        <ToggleRow
          label="Auto commit"
          sublabel="Commit character after inactivity"
          value={automaticModeEnabled}
          onPress={toggleAutoMode}
          testID="auto-mode-switch"
        />

        <View style={styles.divider} />

        <StepperRow
          label="Press threshold"
          sublabel={`Short = dit, long = dah  ·  ≈ ${Math.round(1200 / pressDurationThreshold)} WPM`}
          value={pressDurationThreshold}
          unit="ms"
          step={25}
          min={50}
          max={500}
          onDecrement={() => setPressDurationThreshold(pressDurationThreshold - 25)}
          onIncrement={() => setPressDurationThreshold(pressDurationThreshold + 25)}
        />

        <StepperRow
          label="Commit delay"
          sublabel="Inactivity before character commits"
          value={characterCommitDelay}
          unit="ms"
          step={100}
          min={200}
          max={2000}
          onDecrement={() => setCharacterCommitDelay(characterCommitDelay - 100)}
          onIncrement={() => setCharacterCommitDelay(characterCommitDelay + 100)}
        />

        <View style={styles.divider} />

        <ToggleRow label="Audio" sublabel="Play tone on each tap" value={audioEnabled} onPress={toggleAudio} />
        <ToggleRow label="Haptics" sublabel="Vibrate on each tap" value={hapticsEnabled} onPress={toggleHaptics} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#373532',
    borderBottomWidth: 1,
    borderBottomColor: '#4A4744',
    paddingTop: 12,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E8806A',
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontFamily: 'monospace',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#4A4744',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rowLabel: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: '#F5F3EF',
    fontFamily: 'monospace',
  },
  sublabel: {
    fontSize: 11,
    color: '#9A9590',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  track: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F5F3EF',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#4A4744',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: '#2C2B28',
  },
  stepValue: {
    fontSize: 13,
    color: '#E8806A',
    fontFamily: 'monospace',
    minWidth: 56,
    textAlign: 'center',
  },
});

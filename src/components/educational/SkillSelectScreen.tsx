import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigationStore } from '../../store/navigationStore';
import { useEducationalStore } from '../../store/educationalStore';
import { SkillLevel } from '../../data/levels';

interface SkillOptionProps {
  emoji: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const SkillOption: React.FC<SkillOptionProps> = ({ emoji, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.optionEmoji}>{emoji}</Text>
    <View style={styles.optionText}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export const SkillSelectScreen: React.FC = () => {
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const setSkillLevel = useEducationalStore((s) => s.setSkillLevel);

  const handleSelect = (level: SkillLevel) => {
    setSkillLevel(level);
    navigateTo('level-select');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.decoration}>· − · −  · −  · ·</Text>
        <Text style={styles.title}>Before we start…</Text>
        <Text style={styles.subtitle}>What's your morse experience?</Text>
      </View>

      <View style={styles.options}>
        <SkillOption
          emoji="🌱"
          title="Complete beginner"
          subtitle="I've never used morse code"
          onPress={() => handleSelect('beginner')}
        />
        <SkillOption
          emoji="📚"
          title="Some experience"
          subtitle="I know a few letters"
          onPress={() => handleSelect('intermediate')}
        />
        <SkillOption
          emoji="📻"
          title="I know morse"
          subtitle="Most of the alphabet is familiar"
          onPress={() => handleSelect('experienced')}
        />
      </View>

      <Text style={styles.hint}>
        Beginners see each letter taught before being tested.{'\n'}
        Experienced users have all levels unlocked.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2B28',
    padding: 24,
    justifyContent: 'center',
    gap: 40,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  decoration: {
    fontSize: 13,
    color: 'rgba(232, 128, 106, 0.3)',
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#9A9590',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#373532',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4A4744',
    padding: 18,
    gap: 16,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionText: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#9A9590',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 11,
    color: '#4A4744',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 18,
  },
});

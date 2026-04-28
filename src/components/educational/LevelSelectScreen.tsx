import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigationStore } from '../../store/navigationStore';
import { useEducationalStore } from '../../store/educationalStore';
import { LEVELS, isLevelUnlocked } from '../../data/levels';

export const LevelSelectScreen: React.FC = () => {
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const completedLevelIds = useEducationalStore((s) => s.completedLevelIds);
  const skillLevel = useEducationalStore((s) => s.skillLevel);
  const selectLevel = useEducationalStore((s) => s.selectLevel);

  const handleSelectLevel = (levelId: number) => {
    selectLevel(levelId);
    navigateTo('level');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateTo('menu')} accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={22} color="#9A9590" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learn Morse Code</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {LEVELS.map((level) => {
          const unlocked = isLevelUnlocked(level.id, completedLevelIds, skillLevel);
          const completed = completedLevelIds.includes(level.id);

          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.card,
                !unlocked && styles.cardLocked,
                completed && styles.cardCompleted,
              ]}
              onPress={() => unlocked && handleSelectLevel(level.id)}
              disabled={!unlocked}
              accessibilityLabel={`Level ${level.id}: ${level.title}`}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.levelNumber, !unlocked && styles.textMuted]}>
                  {String(level.id).padStart(2, '0')}
                </Text>
                {completed && (
                  <MaterialCommunityIcons name="check-circle" size={20} color="#E8806A" />
                )}
                {!unlocked && (
                  <MaterialCommunityIcons name="lock-outline" size={20} color="#4A4744" />
                )}
              </View>
              <Text style={[styles.levelTitle, !unlocked && styles.textMuted]}>
                {level.title}
              </Text>
              <Text style={[styles.levelSubtitle, !unlocked && styles.textMuted]}>
                {level.subtitle}
              </Text>
              <Text style={[styles.challengeCount, !unlocked && styles.textMuted]}>
                {level.challenges.length} challenges
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2B28',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#3E3B38',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#4A4744',
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
  },
  grid: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#373532',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A4744',
    padding: 16,
    gap: 4,
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardCompleted: {
    borderColor: 'rgba(232, 128, 106, 0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E8806A',
    fontFamily: 'monospace',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
  },
  levelSubtitle: {
    fontSize: 13,
    color: '#9A9590',
    fontFamily: 'monospace',
  },
  challengeCount: {
    fontSize: 11,
    color: '#9A9590',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  textMuted: {
    color: '#4A4744',
  },
});

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigationStore } from '../../store/navigationStore';
import { useEducationalStore } from '../../store/educationalStore';
import { LEVELS } from '../../data/levels';
import { MultipleChoiceChallenge } from './MultipleChoiceChallenge';
import { MorseInputChallenge } from './MorseInputChallenge';
import { LessonCard } from './LessonCard';

export const LevelScreen: React.FC = () => {
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const selectedLevelId = useEducationalStore((s) => s.selectedLevelId);
  const currentChallengeIndex = useEducationalStore((s) => s.currentChallengeIndex);
  const lastResult = useEducationalStore((s) => s.lastResult);
  const levelComplete = useEducationalStore((s) => s.levelComplete);
  const advanceChallenge = useEducationalStore((s) => s.advanceChallenge);
  const resetLevel = useEducationalStore((s) => s.resetLevel);

  const level = LEVELS.find((l) => l.id === selectedLevelId);

  const handleBack = () => {
    resetLevel();
    navigateTo('level-select');
  };

  if (!level) return null;

  const challenge = level.challenges[currentChallengeIndex];
  const totalChallenges = level.challenges.length;
  const progress = currentChallengeIndex + 1;

  // ── Level complete screen ──────────────────────────────────────────────────
  if (levelComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeScreen}>
          <MaterialCommunityIcons name="check-circle-outline" size={72} color="#E8806A" />
          <Text style={styles.completeTitle}>Level complete!</Text>
          <Text style={styles.completeSubtitle}>{level.title}</Text>

          {level.milestone ? (
            <View style={styles.milestoneCard}>
              <Text style={styles.milestoneText}>{level.milestone}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => {
              resetLevel();
              navigateTo('level-select');
            }}
            accessibilityLabel="Back to levels"
          >
            <Text style={styles.continueBtnText}>Back to levels</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Active challenge ───────────────────────────────────────────────────────
  const isLesson = challenge.type === 'lesson';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={22} color="#9A9590" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{level.title}</Text>
        <Text style={styles.headerProgress}>{progress}/{totalChallenges}</Text>
      </View>

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {level.challenges.map((c, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              c.type === 'lesson' && styles.progressDotLesson,
              i < progress && styles.progressDotDone,
              i === currentChallengeIndex && styles.progressDotCurrent,
            ]}
          />
        ))}
      </View>

      {/* Challenge body */}
      {isLesson ? (
        <LessonCard challenge={challenge} />
      ) : challenge.type === 'multiple-choice' ? (
        <MultipleChoiceChallenge challenge={challenge} />
      ) : (
        <MorseInputChallenge challenge={challenge} />
      )}

      {/* Bottom action area */}
      {isLesson ? (
        <TouchableOpacity
          style={styles.gotItBar}
          onPress={advanceChallenge}
          accessibilityLabel="Got it"
        >
          <Text style={styles.gotItText}>Got it</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#2C2B28" />
        </TouchableOpacity>
      ) : lastResult !== null ? (
        <View style={[
          styles.feedbackBar,
          lastResult === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong,
        ]}>
          <Text style={styles.feedbackIcon}>{lastResult === 'correct' ? '✓' : '✗'}</Text>
          <Text style={styles.feedbackText}>
            {lastResult === 'correct'
              ? 'Correct!'
              : `Wrong — answer: ${challenge.type === 'multiple-choice' ? challenge.correctAnswer : challenge.targetCharacter}`}
          </Text>
          <TouchableOpacity
            onPress={advanceChallenge}
            style={styles.nextBtn}
            accessibilityLabel="Next challenge"
          >
            <Text style={styles.nextBtnText}>Next</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#2C2B28" />
          </TouchableOpacity>
        </View>
      ) : null}
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
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
  },
  headerProgress: {
    fontSize: 13,
    color: '#9A9590',
    fontFamily: 'monospace',
  },
  progressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A4744',
  },
  progressDotLesson: {
    borderRadius: 2, // square for lessons, circle for challenges
  },
  progressDotDone: {
    backgroundColor: '#E8806A',
    opacity: 0.5,
  },
  progressDotCurrent: {
    backgroundColor: '#E8806A',
    opacity: 1,
  },
  gotItBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8806A',
    paddingVertical: 18,
    gap: 8,
  },
  gotItText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C2B28',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  feedbackBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  feedbackCorrect: {
    backgroundColor: '#2A4A3A',
    borderTopWidth: 1,
    borderTopColor: '#4A9A6A',
  },
  feedbackWrong: {
    backgroundColor: '#4A2A28',
    borderTopWidth: 1,
    borderTopColor: '#9A4A44',
  },
  feedbackIcon: {
    fontSize: 18,
    color: '#F5F3EF',
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    color: '#F5F3EF',
    fontFamily: 'monospace',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8806A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  nextBtnText: {
    fontSize: 14,
    color: '#2C2B28',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  completeScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#9A9590',
    fontFamily: 'monospace',
  },
  milestoneCard: {
    marginTop: 8,
    backgroundColor: 'rgba(232, 128, 106, 0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(232, 128, 106, 0.3)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxWidth: 320,
  },
  milestoneText: {
    fontSize: 15,
    color: '#F5F3EF',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 22,
  },
  continueBtn: {
    marginTop: 16,
    backgroundColor: '#E8806A',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueBtnText: {
    fontSize: 16,
    color: '#2C2B28',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
});

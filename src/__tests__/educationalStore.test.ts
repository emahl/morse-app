import { useEducationalStore } from '../store/educationalStore';
import { LEVELS, LessonChallenge, MultipleChoiceChallenge, MorseInputChallenge } from '../data/levels';
import { TAPTYPE_DIT as DIT, TAPTYPE_DAH as DAH } from '../utility/constants';

// Find useful challenge indices across levels
const level1 = LEVELS[0];
const level1FirstMCIndex = level1.challenges.findIndex((c) => c.type === 'multiple-choice');
const level1FirstMCChallenge = level1.challenges[level1FirstMCIndex] as MultipleChoiceChallenge;

const level1FirstInputIndex = level1.challenges.findIndex((c) => c.type === 'morse-input');
const level1FirstInputChallenge = level1.challenges[level1FirstInputIndex] as MorseInputChallenge;

const level1LastIndex = level1.challenges.length - 1;

describe('educationalStore', () => {
  beforeEach(() => {
    useEducationalStore.setState({
      completedLevelIds: [],
      skillLevel: null,
      selectedLevelId: null,
      currentChallengeIndex: 0,
      currentInput: [],
      lastResult: null,
      selectedAnswer: null,
      levelComplete: false,
    });
  });

  describe('setSkillLevel', () => {
    test('sets the skill level', () => {
      useEducationalStore.getState().setSkillLevel('beginner');
      expect(useEducationalStore.getState().skillLevel).toBe('beginner');
    });

    test('can be updated', () => {
      useEducationalStore.getState().setSkillLevel('intermediate');
      useEducationalStore.getState().setSkillLevel('experienced');
      expect(useEducationalStore.getState().skillLevel).toBe('experienced');
    });
  });

  describe('selectLevel', () => {
    test('sets selectedLevelId', () => {
      useEducationalStore.getState().selectLevel(1);
      expect(useEducationalStore.getState().selectedLevelId).toBe(1);
    });

    test('resets all transient state', () => {
      useEducationalStore.setState({
        currentChallengeIndex: 3,
        currentInput: [DIT, DAH],
        lastResult: 'correct',
        selectedAnswer: 'A',
        levelComplete: true,
      });

      useEducationalStore.getState().selectLevel(2);

      const state = useEducationalStore.getState();
      expect(state.currentChallengeIndex).toBe(0);
      expect(state.currentInput).toEqual([]);
      expect(state.lastResult).toBeNull();
      expect(state.selectedAnswer).toBeNull();
      expect(state.levelComplete).toBe(false);
    });

    test('does not reset completedLevelIds or skillLevel', () => {
      useEducationalStore.setState({ completedLevelIds: [1, 2], skillLevel: 'intermediate' });
      useEducationalStore.getState().selectLevel(3);
      expect(useEducationalStore.getState().completedLevelIds).toEqual([1, 2]);
      expect(useEducationalStore.getState().skillLevel).toBe('intermediate');
    });
  });

  describe('addInputTap', () => {
    test('appends a DIT to currentInput', () => {
      useEducationalStore.getState().addInputTap(DIT);
      expect(useEducationalStore.getState().currentInput).toEqual([DIT]);
    });

    test('appends a DAH to currentInput', () => {
      useEducationalStore.getState().addInputTap(DAH);
      expect(useEducationalStore.getState().currentInput).toEqual([DAH]);
    });

    test('accumulates multiple taps', () => {
      useEducationalStore.getState().addInputTap(DIT);
      useEducationalStore.getState().addInputTap(DAH);
      useEducationalStore.getState().addInputTap(DIT);
      expect(useEducationalStore.getState().currentInput).toEqual([DIT, DAH, DIT]);
    });
  });

  describe('clearInput', () => {
    test('empties currentInput', () => {
      useEducationalStore.setState({ currentInput: [DIT, DAH, DIT] });
      useEducationalStore.getState().clearInput();
      expect(useEducationalStore.getState().currentInput).toEqual([]);
    });
  });

  describe('submitAnswer (multiple-choice)', () => {
    beforeEach(() => {
      useEducationalStore.getState().selectLevel(1);
      // Move past any lesson cards to the first MC challenge
      useEducationalStore.setState({ currentChallengeIndex: level1FirstMCIndex });
    });

    test('sets lastResult to correct when answer matches', () => {
      useEducationalStore.getState().submitAnswer(level1FirstMCChallenge.correctAnswer);
      expect(useEducationalStore.getState().lastResult).toBe('correct');
    });

    test('sets lastResult to incorrect when answer does not match', () => {
      const wrongAnswer = level1FirstMCChallenge.options.find(
        (o) => o !== level1FirstMCChallenge.correctAnswer,
      )!;
      useEducationalStore.getState().submitAnswer(wrongAnswer);
      expect(useEducationalStore.getState().lastResult).toBe('incorrect');
    });

    test('records the selected answer', () => {
      useEducationalStore.getState().submitAnswer(level1FirstMCChallenge.correctAnswer);
      expect(useEducationalStore.getState().selectedAnswer).toBe(level1FirstMCChallenge.correctAnswer);
    });

    test('is case-insensitive', () => {
      useEducationalStore.getState().submitAnswer(level1FirstMCChallenge.correctAnswer.toLowerCase());
      expect(useEducationalStore.getState().lastResult).toBe('correct');
    });

    test('is a no-op on lesson challenges', () => {
      useEducationalStore.setState({ currentChallengeIndex: 0 }); // lesson
      useEducationalStore.getState().submitAnswer('S');
      expect(useEducationalStore.getState().lastResult).toBeNull();
    });
  });

  describe('submitMorseInput', () => {
    beforeEach(() => {
      useEducationalStore.getState().selectLevel(1);
      useEducationalStore.setState({ currentChallengeIndex: level1FirstInputIndex });
    });

    test('sets lastResult to correct when sequence matches', () => {
      useEducationalStore.setState({ currentInput: level1FirstInputChallenge.targetSequence });
      useEducationalStore.getState().submitMorseInput();
      expect(useEducationalStore.getState().lastResult).toBe('correct');
    });

    test('sets lastResult to incorrect when sequence is wrong', () => {
      useEducationalStore.setState({ currentInput: [DAH] });
      useEducationalStore.getState().submitMorseInput();
      expect(useEducationalStore.getState().lastResult).toBe('incorrect');
    });

    test('sets lastResult to incorrect when sequence has extra taps', () => {
      useEducationalStore.setState({
        currentInput: [...level1FirstInputChallenge.targetSequence, DIT],
      });
      useEducationalStore.getState().submitMorseInput();
      expect(useEducationalStore.getState().lastResult).toBe('incorrect');
    });

    test('sets lastResult to incorrect when sequence is empty', () => {
      useEducationalStore.setState({ currentInput: [] });
      useEducationalStore.getState().submitMorseInput();
      expect(useEducationalStore.getState().lastResult).toBe('incorrect');
    });
  });

  describe('advanceChallenge', () => {
    beforeEach(() => {
      useEducationalStore.getState().selectLevel(1);
      useEducationalStore.setState({ lastResult: 'correct' });
    });

    test('increments currentChallengeIndex', () => {
      useEducationalStore.getState().advanceChallenge();
      expect(useEducationalStore.getState().currentChallengeIndex).toBe(1);
    });

    test('resets lastResult and selectedAnswer to null', () => {
      useEducationalStore.setState({ selectedAnswer: 'S' });
      useEducationalStore.getState().advanceChallenge();
      expect(useEducationalStore.getState().lastResult).toBeNull();
      expect(useEducationalStore.getState().selectedAnswer).toBeNull();
    });

    test('resets currentInput', () => {
      useEducationalStore.setState({ currentInput: [DIT, DAH] });
      useEducationalStore.getState().advanceChallenge();
      expect(useEducationalStore.getState().currentInput).toEqual([]);
    });

    test('sets levelComplete when advancing past the last challenge', () => {
      useEducationalStore.setState({ currentChallengeIndex: level1LastIndex });
      useEducationalStore.getState().advanceChallenge();
      expect(useEducationalStore.getState().levelComplete).toBe(true);
    });

    test('adds level to completedLevelIds on completion', () => {
      useEducationalStore.setState({ currentChallengeIndex: level1LastIndex });
      useEducationalStore.getState().advanceChallenge();
      expect(useEducationalStore.getState().completedLevelIds).toContain(1);
    });

    test('does not duplicate level in completedLevelIds', () => {
      useEducationalStore.setState({
        currentChallengeIndex: level1LastIndex,
        completedLevelIds: [1],
      });
      useEducationalStore.getState().advanceChallenge();
      const ids = useEducationalStore.getState().completedLevelIds;
      expect(ids.filter((id) => id === 1)).toHaveLength(1);
    });

    test('completedLevelIds persists across selectLevel calls', () => {
      useEducationalStore.setState({ currentChallengeIndex: level1LastIndex });
      useEducationalStore.getState().advanceChallenge();
      expect(useEducationalStore.getState().completedLevelIds).toContain(1);

      useEducationalStore.getState().selectLevel(2);
      expect(useEducationalStore.getState().completedLevelIds).toContain(1);
    });
  });

  describe('resetLevel', () => {
    test('resets transient state without clearing completedLevelIds or skillLevel', () => {
      useEducationalStore.setState({
        completedLevelIds: [1],
        skillLevel: 'intermediate',
        currentChallengeIndex: 3,
        currentInput: [DIT],
        lastResult: 'incorrect',
        selectedAnswer: 'X',
        levelComplete: true,
      });

      useEducationalStore.getState().resetLevel();

      const state = useEducationalStore.getState();
      expect(state.currentChallengeIndex).toBe(0);
      expect(state.currentInput).toEqual([]);
      expect(state.lastResult).toBeNull();
      expect(state.selectedAnswer).toBeNull();
      expect(state.levelComplete).toBe(false);
      expect(state.completedLevelIds).toEqual([1]);
      expect(state.skillLevel).toBe('intermediate');
    });
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MultipleChoiceChallenge } from '../components/educational/MultipleChoiceChallenge';
import { useEducationalStore } from '../store/educationalStore';
import { LEVELS, MultipleChoiceChallenge as MCType } from '../data/levels';

// Use the first MC challenge from Level 1 (after the lesson cards)
const level1 = LEVELS[0];
const firstMCIndex = level1.challenges.findIndex((c) => c.type === 'multiple-choice');
const challenge = level1.challenges[firstMCIndex] as MCType;
const wrongOption = challenge.options.find((o) => o !== challenge.correctAnswer)!;

function resetStore() {
  useEducationalStore.setState({
    completedLevelIds: [],
    skillLevel: null,
    selectedLevelId: 1,
    currentChallengeIndex: firstMCIndex,
    currentInput: [],
    lastResult: null,
    selectedAnswer: null,
    levelComplete: false,
  });
}

describe('MultipleChoiceChallenge', () => {
  beforeEach(resetStore);

  test('renders instruction and all three options', () => {
    const { getByText, getByLabelText } = render(<MultipleChoiceChallenge challenge={challenge} />);
    expect(getByText(challenge.instruction)).toBeTruthy();
    challenge.options.forEach((opt) => {
      expect(getByLabelText(`Option ${opt}`)).toBeTruthy();
    });
  });

  test('all options are enabled before answering', () => {
    const { getByLabelText } = render(<MultipleChoiceChallenge challenge={challenge} />);
    challenge.options.forEach((opt) => {
      expect(getByLabelText(`Option ${opt}`).getAttribute('aria-disabled')).not.toBe('true');
    });
  });

  describe('correct answer', () => {
    test('sets lastResult to correct and records selectedAnswer', () => {
      const { getByLabelText } = render(<MultipleChoiceChallenge challenge={challenge} />);
      fireEvent.click(getByLabelText(`Option ${challenge.correctAnswer}`));
      const state = useEducationalStore.getState();
      expect(state.lastResult).toBe('correct');
      expect(state.selectedAnswer).toBe(challenge.correctAnswer);
    });

    test('disables all options after selection', () => {
      const { getByLabelText, rerender } = render(<MultipleChoiceChallenge challenge={challenge} />);
      fireEvent.click(getByLabelText(`Option ${challenge.correctAnswer}`));
      rerender(<MultipleChoiceChallenge challenge={challenge} />);
      challenge.options.forEach((opt) => {
        expect(getByLabelText(`Option ${opt}`).getAttribute('aria-disabled')).toBe('true');
      });
    });
  });

  describe('wrong answer', () => {
    test('sets lastResult to incorrect and records selectedAnswer', () => {
      const { getByLabelText } = render(<MultipleChoiceChallenge challenge={challenge} />);
      fireEvent.click(getByLabelText(`Option ${wrongOption}`));
      const state = useEducationalStore.getState();
      expect(state.lastResult).toBe('incorrect');
      expect(state.selectedAnswer).toBe(wrongOption);
    });

    test('selectedAnswer is the wrong option, not the correct one', () => {
      const { getByLabelText } = render(<MultipleChoiceChallenge challenge={challenge} />);
      fireEvent.click(getByLabelText(`Option ${wrongOption}`));
      expect(useEducationalStore.getState().selectedAnswer).toBe(wrongOption);
      expect(useEducationalStore.getState().selectedAnswer).not.toBe(challenge.correctAnswer);
    });

    test('correct answer is NOT highlighted (lastResult stays incorrect, no green applied)', () => {
      // Green highlight is gated on lastResult === 'correct', so a wrong pick must leave
      // the correct option unstyled — we verify via store state since jsdom can't inspect
      // computed RN styles.
      const { getByLabelText } = render(<MultipleChoiceChallenge challenge={challenge} />);
      fireEvent.click(getByLabelText(`Option ${wrongOption}`));
      expect(useEducationalStore.getState().lastResult).toBe('incorrect');
      // The correct option was not picked, so it should not appear as selectedAnswer
      expect(useEducationalStore.getState().selectedAnswer).not.toBe(challenge.correctAnswer);
    });

    test('disables all options after selection', () => {
      const { getByLabelText, rerender } = render(<MultipleChoiceChallenge challenge={challenge} />);
      fireEvent.click(getByLabelText(`Option ${wrongOption}`));
      rerender(<MultipleChoiceChallenge challenge={challenge} />);
      challenge.options.forEach((opt) => {
        expect(getByLabelText(`Option ${opt}`).getAttribute('aria-disabled')).toBe('true');
      });
    });

    test('does not re-submit if options are tapped again while answered', () => {
      useEducationalStore.setState({ lastResult: 'incorrect', selectedAnswer: wrongOption });
      const { getByLabelText } = render(<MultipleChoiceChallenge challenge={challenge} />);
      const stateBefore = useEducationalStore.getState();

      // Try tapping the correct option — should be ignored since answered
      fireEvent.click(getByLabelText(`Option ${challenge.correctAnswer}`));
      const stateAfter = useEducationalStore.getState();

      expect(stateAfter.lastResult).toBe(stateBefore.lastResult);
      expect(stateAfter.selectedAnswer).toBe(stateBefore.selectedAnswer);
    });
  });

  describe('retry resets state', () => {
    test('after retryChallenge, lastResult and selectedAnswer are null', () => {
      const { getByLabelText } = render(<MultipleChoiceChallenge challenge={challenge} />);
      fireEvent.click(getByLabelText(`Option ${wrongOption}`));
      expect(useEducationalStore.getState().lastResult).toBe('incorrect');

      useEducationalStore.getState().retryChallenge();

      const state = useEducationalStore.getState();
      expect(state.lastResult).toBeNull();
      expect(state.selectedAnswer).toBeNull();
    });

    test('options are re-enabled after retry', () => {
      const { getByLabelText, rerender } = render(<MultipleChoiceChallenge challenge={challenge} />);
      fireEvent.click(getByLabelText(`Option ${wrongOption}`));
      useEducationalStore.getState().retryChallenge();
      rerender(<MultipleChoiceChallenge challenge={challenge} />);
      challenge.options.forEach((opt) => {
        expect(getByLabelText(`Option ${opt}`).getAttribute('aria-disabled')).not.toBe('true');
      });
    });
  });
});

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TapType } from '../utility/constants';
import { LEVELS, SkillLevel } from '../data/levels';
import { appJSONStorage } from '../utility/storage';

function arraysEqual(a: TapType[], b: TapType[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export interface EducationalStore {
  // Persists across app launches
  completedLevelIds: number[];
  skillLevel: SkillLevel | null;

  // Set when entering a level
  selectedLevelId: number | null;
  currentChallengeIndex: number;

  // Per-challenge transient state
  currentInput: TapType[];
  lastResult: 'correct' | 'incorrect' | null;
  selectedAnswer: string | null;
  levelComplete: boolean;

  // Actions
  setSkillLevel: (level: SkillLevel) => void;
  selectLevel: (levelId: number) => void;
  addInputTap: (tap: TapType) => void;
  clearInput: () => void;
  submitAnswer: (answer: string) => void;
  submitMorseInput: () => void;
  advanceChallenge: () => void;
  retryChallenge: () => void;
  resetLevel: () => void;
}

export const useEducationalStore = create<EducationalStore>()(
  persist(
    (set, get) => ({
      completedLevelIds: [],
      skillLevel: null,
      selectedLevelId: null,
      currentChallengeIndex: 0,
      currentInput: [],
      lastResult: null,
      selectedAnswer: null,
      levelComplete: false,

      setSkillLevel: (level) => {
        set({ skillLevel: level });
      },

      selectLevel: (levelId) => {
        set({
          selectedLevelId: levelId,
          currentChallengeIndex: 0,
          currentInput: [],
          lastResult: null,
          selectedAnswer: null,
          levelComplete: false,
        });
      },

      addInputTap: (tap) => {
        set((state) => ({ currentInput: [...state.currentInput, tap] }));
      },

      clearInput: () => {
        set({ currentInput: [] });
      },

      submitAnswer: (answer) => {
        const { selectedLevelId, currentChallengeIndex } = get();
        const level = LEVELS.find((l) => l.id === selectedLevelId);
        if (!level) return;
        const challenge = level.challenges[currentChallengeIndex];
        if (challenge.type !== 'multiple-choice' && challenge.type !== 'audio-copy') return;
        const isCorrect =
          answer.trim().toUpperCase() === challenge.correctAnswer.trim().toUpperCase();
        set({ lastResult: isCorrect ? 'correct' : 'incorrect', selectedAnswer: answer });
      },

      submitMorseInput: () => {
        const { selectedLevelId, currentChallengeIndex, currentInput } = get();
        const level = LEVELS.find((l) => l.id === selectedLevelId);
        if (!level) return;
        const challenge = level.challenges[currentChallengeIndex];
        if (challenge.type !== 'morse-input' && challenge.type !== 'word-input') return;
        const targetSeq =
          challenge.type === 'word-input'
            ? challenge.targetCharacters.flatMap((c) => c.sequence)
            : challenge.targetSequence;
        const isCorrect = arraysEqual(currentInput, targetSeq);
        set({ lastResult: isCorrect ? 'correct' : 'incorrect' });
      },

      advanceChallenge: () => {
        const { selectedLevelId, currentChallengeIndex, completedLevelIds } = get();
        const level = LEVELS.find((l) => l.id === selectedLevelId);
        if (!level) return;

        const nextIndex = currentChallengeIndex + 1;
        if (nextIndex >= level.challenges.length) {
          const newCompleted = completedLevelIds.includes(selectedLevelId!)
            ? completedLevelIds
            : [...completedLevelIds, selectedLevelId!];
          set({
            levelComplete: true,
            completedLevelIds: newCompleted,
            lastResult: null,
            selectedAnswer: null,
            currentInput: [],
          });
        } else {
          set({
            currentChallengeIndex: nextIndex,
            currentInput: [],
            lastResult: null,
            selectedAnswer: null,
          });
        }
      },

      retryChallenge: () => {
        set({ lastResult: null, selectedAnswer: null, currentInput: [] });
      },

      resetLevel: () => {
        set({
          currentChallengeIndex: 0,
          currentInput: [],
          lastResult: null,
          selectedAnswer: null,
          levelComplete: false,
        });
      },
    }),
    {
      name: 'edu-progress',
      storage: appJSONStorage,
      partialize: (state) => ({
        completedLevelIds: state.completedLevelIds,
        skillLevel: state.skillLevel,
      }),
    },
  ),
);

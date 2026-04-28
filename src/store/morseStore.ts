import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TapType, ORIGINAL_MESSAGE } from '../utility/constants';
import { getCharacterBySequence } from '../utility/morseTree';
import { appJSONStorage } from '../utility/storage';

export interface MorseStore {
  // State
  text: string;
  morseSequence: TapType[];
  currentCharacter: string;
  ditDahText: string;
  automaticModeEnabled: boolean;
  showMorseTree: boolean;
  showSettings: boolean;

  // Settings
  pressDurationThreshold: number;
  characterCommitDelay: number;
  audioEnabled: boolean;
  hapticsEnabled: boolean;

  // Actions
  addTap: (type: TapType) => void;
  commitCharacter: () => void;
  insertSpace: () => void;
  clearAll: () => void;
  toggleAutoMode: () => void;
  toggleMorseTree: () => void;
  toggleSettings: () => void;
  setDitDahText: (text: string) => void;
  clearDitDahText: () => void;
  setPressDurationThreshold: (value: number) => void;
  setCharacterCommitDelay: (value: number) => void;
  toggleAudio: () => void;
  toggleHaptics: () => void;
}

export const useMorseStore = create<MorseStore>()(
  persist(
    (set, get) => ({
      // Initial state
      text: ORIGINAL_MESSAGE,
      morseSequence: [],
      currentCharacter: '',
      ditDahText: '',
      automaticModeEnabled: true,
      showMorseTree: false,
      showSettings: false,

      // Settings defaults
      pressDurationThreshold: 150,
      characterCommitDelay: 800,
      audioEnabled: true,
      hapticsEnabled: true,

      // Actions
      addTap: (type: TapType) => {
        set((state) => {
          const newSequence = [...state.morseSequence, type];

          // If this is the first tap, clear the placeholder
          let newText = state.text;
          if (state.text === ORIGINAL_MESSAGE && state.morseSequence.length === 0) {
            newText = '';
          }

          const currentCharacter = getCharacterBySequence(newSequence);

          return {
            text: newText,
            morseSequence: newSequence,
            currentCharacter,
          };
        });
      },

      commitCharacter: () => {
        const { morseSequence, text } = get();
        if (morseSequence.length > 0) {
          const character = getCharacterBySequence(morseSequence);
          set({
            text: text + character,
            morseSequence: [],
            currentCharacter: '',
          });
        }
      },

      insertSpace: () => {
        set((state) => {
          // No space on empty/placeholder text, no consecutive spaces
          if (
            state.text.length === 0 ||
            state.text === ORIGINAL_MESSAGE ||
            state.text.endsWith(' ')
          ) {
            return state;
          }
          return { text: state.text + ' ' };
        });
      },

      clearAll: () => {
        set({
          text: ORIGINAL_MESSAGE,
          morseSequence: [],
          currentCharacter: '',
        });
      },

      toggleAutoMode: () => {
        set((state) => ({
          automaticModeEnabled: !state.automaticModeEnabled,
        }));
      },

      toggleMorseTree: () => {
        set((state) => ({
          showMorseTree: !state.showMorseTree,
        }));
      },

      toggleSettings: () => {
        set((state) => ({
          showSettings: !state.showSettings,
        }));
      },

      setDitDahText: (text: string) => {
        set({ ditDahText: text });
      },

      clearDitDahText: () => {
        set({ ditDahText: '' });
      },

      setPressDurationThreshold: (value: number) =>
        set({ pressDurationThreshold: Math.max(50, Math.min(500, value)) }),

      setCharacterCommitDelay: (value: number) =>
        set({ characterCommitDelay: Math.max(200, Math.min(2000, value)) }),

      toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
    }),
    {
      name: 'morse-settings',
      storage: appJSONStorage,
      partialize: (state) => ({
        automaticModeEnabled: state.automaticModeEnabled,
        pressDurationThreshold: state.pressDurationThreshold,
        characterCommitDelay: state.characterCommitDelay,
        audioEnabled: state.audioEnabled,
        hapticsEnabled: state.hapticsEnabled,
      }),
    },
  ),
);

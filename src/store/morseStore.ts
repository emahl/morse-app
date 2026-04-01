import { create } from 'zustand';
import { TapType, ORIGINAL_MESSAGE } from '../utility/constants';
import { getCharacterBySequence } from '../utility/morseTree';

export interface MorseStore {
  // State
  text: string;
  morseSequence: TapType[];
  currentCharacter: string;
  ditDahText: string;
  automaticModeEnabled: boolean;
  showMorseTree: boolean;

  // Actions
  addTap: (type: TapType) => void;
  commitCharacter: () => void;
  insertSpace: () => void;
  clearAll: () => void;
  toggleAutoMode: () => void;
  toggleMorseTree: () => void;
  setDitDahText: (text: string) => void;
  clearDitDahText: () => void;
}

export const useMorseStore = create<MorseStore>((set, get) => ({
  // Initial state
  text: ORIGINAL_MESSAGE,
  morseSequence: [],
  currentCharacter: '',
  ditDahText: '',
  automaticModeEnabled: true,
  showMorseTree: false,

  // Actions
  addTap: (type: TapType) => {
    set((state) => {
      const newSequence = [...state.morseSequence, type];

      // If this is the first tap, clear the placeholder
      let newText = state.text;
      if (state.text === ORIGINAL_MESSAGE && state.morseSequence.length === 0) {
        newText = '';
      }

      // Calculate the current character for this sequence
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
    set((state) => ({
      text: state.text + ' ',
    }));
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

  setDitDahText: (text: string) => {
    set({
      ditDahText: text,
    });
  },

  clearDitDahText: () => {
    set({
      ditDahText: '',
    });
  },
}));

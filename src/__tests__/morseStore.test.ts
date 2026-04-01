import { useMorseStore } from '../store/morseStore';
import { TAPTYPE_DIT, TAPTYPE_DAH, ORIGINAL_MESSAGE } from '../utility/constants';
import { getCharacterBySequence } from '../utility/morseTree';

describe('Morse Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { clearAll } = useMorseStore.getState();
    clearAll();
  });

  describe('addTap', () => {
    test('addTap with DIT adds to sequence and updates currentCharacter', () => {
      const { addTap, morseSequence, currentCharacter } = useMorseStore.getState();
      addTap(TAPTYPE_DIT);

      expect(useMorseStore.getState().morseSequence).toContain(TAPTYPE_DIT);
      expect(useMorseStore.getState().currentCharacter).toBe('E'); // DIT alone = E
    });

    test('addTap with DAH adds to sequence and updates currentCharacter', () => {
      const { addTap } = useMorseStore.getState();
      addTap(TAPTYPE_DAH);

      expect(useMorseStore.getState().morseSequence).toContain(TAPTYPE_DAH);
      expect(useMorseStore.getState().currentCharacter).toBe('T'); // DAH alone = T
    });

    test('multiple addTaps build sequence correctly', () => {
      const { addTap } = useMorseStore.getState();
      addTap(TAPTYPE_DIT);
      addTap(TAPTYPE_DAH);

      const state = useMorseStore.getState();
      expect(state.morseSequence).toEqual([TAPTYPE_DIT, TAPTYPE_DAH]);
      expect(state.currentCharacter).toBe('A'); // DIT-DAH = A
    });

    test('first tap clears placeholder text', () => {
      expect(useMorseStore.getState().text).toBe(ORIGINAL_MESSAGE);

      const { addTap } = useMorseStore.getState();
      addTap(TAPTYPE_DIT);

      expect(useMorseStore.getState().text).toBe(''); // Placeholder cleared
    });

    test('first tap does NOT clear text on second addTap', () => {
      const { addTap } = useMorseStore.getState();
      addTap(TAPTYPE_DIT);
      const textAfterFirstTap = useMorseStore.getState().text;

      addTap(TAPTYPE_DAH);
      const textAfterSecondTap = useMorseStore.getState().text;

      expect(textAfterFirstTap).toBe('');
      expect(textAfterSecondTap).toBe(''); // Still empty, no additional clearing
    });
  });

  describe('commitCharacter', () => {
    test('commitCharacter with sequence appends character to text', () => {
      const { addTap, commitCharacter } = useMorseStore.getState();
      addTap(TAPTYPE_DIT);
      addTap(TAPTYPE_DAH);

      commitCharacter();

      const state = useMorseStore.getState();
      expect(state.text).toBe('A'); // DIT-DAH = A
      expect(state.morseSequence).toEqual([]); // Sequence cleared
      expect(state.currentCharacter).toBe(''); // Preview cleared
    });

    test('commitCharacter with empty sequence is a no-op', () => {
      const { commitCharacter } = useMorseStore.getState();
      const textBefore = useMorseStore.getState().text;

      commitCharacter();

      const textAfter = useMorseStore.getState().text;
      expect(textAfter).toBe(textBefore); // No change
    });

    test('commitCharacter multiple times appends each character', () => {
      const { addTap, commitCharacter } = useMorseStore.getState();

      // Add DIT, commit (E)
      addTap(TAPTYPE_DIT);
      commitCharacter();

      // Add DIT-DAH, commit (A)
      addTap(TAPTYPE_DIT);
      addTap(TAPTYPE_DAH);
      commitCharacter();

      const state = useMorseStore.getState();
      expect(state.text).toBe('EA');
    });
  });

  describe('insertSpace', () => {
    test('insertSpace appends a space to text', () => {
      const { insertSpace } = useMorseStore.getState();
      const textBefore = useMorseStore.getState().text;

      insertSpace();

      expect(useMorseStore.getState().text).toBe(textBefore + ' ');
    });

    test('insertSpace works after commitCharacter', () => {
      const { addTap, commitCharacter, insertSpace } = useMorseStore.getState();

      addTap(TAPTYPE_DIT);
      addTap(TAPTYPE_DAH);
      commitCharacter();

      insertSpace();

      expect(useMorseStore.getState().text).toBe('A ');
    });
  });

  describe('clearAll', () => {
    test('clearAll resets text, sequence, and currentCharacter', () => {
      const { addTap, commitCharacter, toggleAutoMode, toggleMorseTree, clearAll } =
        useMorseStore.getState();

      // Set up some state changes
      addTap(TAPTYPE_DIT);
      commitCharacter();
      toggleAutoMode();
      toggleMorseTree();

      clearAll();

      const state = useMorseStore.getState();
      expect(state.text).toBe(ORIGINAL_MESSAGE);
      expect(state.morseSequence).toEqual([]);
      expect(state.currentCharacter).toBe('');
      // Note: clearAll does NOT reset automaticModeEnabled and showMorseTree
      // Those are user preferences that persist
    });
  });

  describe('toggleAutoMode', () => {
    test('toggleAutoMode flips automaticModeEnabled', () => {
      const initialState = useMorseStore.getState().automaticModeEnabled;

      const { toggleAutoMode } = useMorseStore.getState();
      toggleAutoMode();

      expect(useMorseStore.getState().automaticModeEnabled).toBe(!initialState);

      toggleAutoMode();

      expect(useMorseStore.getState().automaticModeEnabled).toBe(initialState);
    });
  });

  describe('toggleMorseTree', () => {
    test('toggleMorseTree flips showMorseTree', () => {
      const initialState = useMorseStore.getState().showMorseTree;

      const { toggleMorseTree } = useMorseStore.getState();
      toggleMorseTree();

      expect(useMorseStore.getState().showMorseTree).toBe(!initialState);

      toggleMorseTree();

      expect(useMorseStore.getState().showMorseTree).toBe(initialState);
    });
  });

  describe('setDitDahText and clearDitDahText', () => {
    test('setDitDahText sets the transient text', () => {
      const { setDitDahText } = useMorseStore.getState();
      setDitDahText('dit');

      expect(useMorseStore.getState().ditDahText).toBe('dit');

      setDitDahText('dah');
      expect(useMorseStore.getState().ditDahText).toBe('dah');
    });

    test('clearDitDahText clears the transient text', () => {
      const { setDitDahText, clearDitDahText } = useMorseStore.getState();
      setDitDahText('dit');
      expect(useMorseStore.getState().ditDahText).toBe('dit');

      clearDitDahText();
      expect(useMorseStore.getState().ditDahText).toBe('');
    });
  });
});

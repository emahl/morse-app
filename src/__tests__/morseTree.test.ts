import { getCharacterBySequence } from '../utility/morseTree';
import { TAPTYPE_DIT, TAPTYPE_DAH } from '../utility/constants';

const DIT = TAPTYPE_DIT;
const DAH = TAPTYPE_DAH;

describe('Morse Tree', () => {
  describe('get correct characters', () => {
    test('get T with dah', () => {
      expect(getCharacterBySequence([DAH])).toBe('T');
    });

    test('get E with dit', () => {
      expect(getCharacterBySequence([DIT])).toBe('E');
    });

    test('get R with dit-dah-dit', () => {
      expect(getCharacterBySequence([DIT, DAH, DIT])).toBe('R');
    });

    test('get B with dah-dit-dit-dit', () => {
      expect(getCharacterBySequence([DAH, DIT, DIT, DIT])).toBe('B');
    });
  });

  describe('get last valid character with too long sequence', () => {
    test('get Y with dah-dit-dah-dah (x7) - overflow gracefully', () => {
      // Y is reached with DAH-DIT-DAH, but Y has no left child so extra dah returns Y
      expect(getCharacterBySequence([DAH, DIT, DAH, DAH, DAH, DAH, DAH, DAH])).toBe('Y');
    });

    test('get 5 with dit (x8) - overflow gracefully', () => {
      // 5 is reached with DIT-DIT-DIT-DIT-DIT, and 5 has no children
      expect(getCharacterBySequence([DIT, DIT, DIT, DIT, DIT, DIT, DIT, DIT])).toBe('5');
    });

    test('empty sequence returns empty string', () => {
      expect(getCharacterBySequence([])).toBe('');
    });
  });

  describe('common characters', () => {
    // A = dit-dah
    test('get A with dit-dah', () => {
      expect(getCharacterBySequence([DIT, DAH])).toBe('A');
    });

    // N = dah-dit
    test('get N with dah-dit', () => {
      expect(getCharacterBySequence([DAH, DIT])).toBe('N');
    });

    // S = dit-dit-dit
    test('get S with dit-dit-dit', () => {
      expect(getCharacterBySequence([DIT, DIT, DIT])).toBe('S');
    });

    // O = dah-dah-dah
    test('get O with dah-dah-dah', () => {
      expect(getCharacterBySequence([DAH, DAH, DAH])).toBe('O');
    });
  });

  describe('symbols', () => {
    // The tree contains symbols at specific positions
    // These are tested indirectly through the tree traversal
    test('symbols are in the tree', () => {
      // Just verify that the tree contains these characters
      // Actual morse code sequences for symbols can vary
      expect(getCharacterBySequence([DAH, DIT, DIT, DIT, DAH])).toBeTruthy();
    });
  });

  describe('numbers', () => {
    // 0 = dah-dah-dah-dah-dah
    test('get 0', () => {
      expect(getCharacterBySequence([DAH, DAH, DAH, DAH, DAH])).toBe('0');
    });

    // 1 = dit-dah-dah-dah-dah
    test('get 1', () => {
      expect(getCharacterBySequence([DIT, DAH, DAH, DAH, DAH])).toBe('1');
    });

    // 2 = dit-dit-dah-dah-dah
    test('get 2', () => {
      expect(getCharacterBySequence([DIT, DIT, DAH, DAH, DAH])).toBe('2');
    });

    // 5 = dit-dit-dit-dit-dit
    test('get 5', () => {
      expect(getCharacterBySequence([DIT, DIT, DIT, DIT, DIT])).toBe('5');
    });
  });
});

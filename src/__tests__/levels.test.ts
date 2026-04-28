import { TAPTYPE_DIT as DIT, TAPTYPE_DAH as DAH } from '../utility/constants';
import {
  LEVELS,
  sequenceToDisplay,
  isLevelUnlocked,
  LessonChallenge,
  MultipleChoiceChallenge,
  MorseInputChallenge,
} from '../data/levels';
import { getCharacterBySequence } from '../utility/morseTree';

describe('Level data integrity', () => {
  test('there are exactly 5 levels', () => {
    expect(LEVELS).toHaveLength(5);
  });

  test('level IDs are sequential starting from 1', () => {
    LEVELS.forEach((level, i) => {
      expect(level.id).toBe(i + 1);
    });
  });

  test('every level has a title, subtitle, milestone, and at least one challenge', () => {
    LEVELS.forEach((level) => {
      expect(level.title.length).toBeGreaterThan(0);
      expect(level.subtitle.length).toBeGreaterThan(0);
      expect(level.milestone.length).toBeGreaterThan(0);
      expect(level.challenges.length).toBeGreaterThan(0);
    });
  });

  test('every level starts with at least one lesson challenge', () => {
    LEVELS.forEach((level) => {
      expect(level.challenges[0].type).toBe('lesson');
    });
  });

  describe('lesson challenges', () => {
    test('every lesson has a non-empty character, sequence, and description', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is LessonChallenge => c.type === 'lesson')
          .forEach((c) => {
            expect(c.character.length).toBeGreaterThan(0);
            expect(c.sequence.length).toBeGreaterThan(0);
            expect(c.description.length).toBeGreaterThan(0);
          });
      });
    });

    test('lesson sequence decodes to the correct character', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is LessonChallenge => c.type === 'lesson')
          .forEach((c) => {
            expect(getCharacterBySequence(c.sequence)).toBe(c.character);
          });
      });
    });
  });

  describe('multiple-choice challenges', () => {
    test('each challenge has exactly 3 options including the correct answer', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is MultipleChoiceChallenge => c.type === 'multiple-choice')
          .forEach((c) => {
            expect(c.options).toHaveLength(3);
            expect(c.options).toContain(c.correctAnswer);
          });
      });
    });

    test('when morseSequence is present, it decodes to correctAnswer', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is MultipleChoiceChallenge => c.type === 'multiple-choice')
          .forEach((c) => {
            if (!c.morseSequence) return;
            expect(getCharacterBySequence(c.morseSequence)).toBe(c.correctAnswer);
          });
      });
    });
  });

  describe('morse-input challenges', () => {
    test('targetSequence decodes to targetCharacter', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is MorseInputChallenge => c.type === 'morse-input')
          .forEach((c) => {
            expect(getCharacterBySequence(c.targetSequence)).toBe(c.targetCharacter);
          });
      });
    });
  });

  describe('Level 1: SOS', () => {
    const level = LEVELS[0];

    test('has 7 challenges (2 lesson + 3 MC + 2 input)', () => {
      expect(level.challenges).toHaveLength(7);
    });

    test('contains S and O lessons', () => {
      const lessons = level.challenges.filter((c): c is LessonChallenge => c.type === 'lesson');
      const chars = lessons.map((c) => c.character);
      expect(chars).toContain('S');
      expect(chars).toContain('O');
    });
  });

  describe('Level 2: E and T', () => {
    const level = LEVELS[1];

    test('has 6 challenges (2 lesson + 2 MC + 2 input)', () => {
      expect(level.challenges).toHaveLength(6);
    });

    test('contains E and T lessons', () => {
      const lessons = level.challenges.filter((c): c is LessonChallenge => c.type === 'lesson');
      const chars = lessons.map((c) => c.character);
      expect(chars).toContain('E');
      expect(chars).toContain('T');
    });
  });

  describe('Level 3: I, A, N', () => {
    const level = LEVELS[2];

    test('has 9 challenges (3 lesson + 3 MC + 3 input)', () => {
      expect(level.challenges).toHaveLength(9);
    });

    test('contains I, A, N lessons', () => {
      const lessons = level.challenges.filter((c): c is LessonChallenge => c.type === 'lesson');
      const chars = lessons.map((c) => c.character);
      expect(chars).toContain('I');
      expect(chars).toContain('A');
      expect(chars).toContain('N');
    });
  });

  describe('Level 4: M, R, U', () => {
    const level = LEVELS[3];

    test('has 9 challenges (3 lesson + 3 MC + 3 input)', () => {
      expect(level.challenges).toHaveLength(9);
    });
  });

  describe('Level 5: Numbers', () => {
    const level = LEVELS[4];

    test('has 6 challenges (3 lesson + 3 MC)', () => {
      expect(level.challenges).toHaveLength(6);
    });
  });
});

describe('sequenceToDisplay', () => {
  test('converts DIT to ·', () => {
    expect(sequenceToDisplay([DIT])).toBe('·');
  });

  test('converts DAH to −', () => {
    expect(sequenceToDisplay([DAH])).toBe('−');
  });

  test('separates elements with spaces', () => {
    expect(sequenceToDisplay([DIT, DAH])).toBe('· −');
  });

  test('handles SOS sequence correctly', () => {
    expect(sequenceToDisplay([DIT, DIT, DIT])).toBe('· · ·');
    expect(sequenceToDisplay([DAH, DAH, DAH])).toBe('− − −');
  });

  test('returns empty string for empty sequence', () => {
    expect(sequenceToDisplay([])).toBe('');
  });
});

describe('isLevelUnlocked', () => {
  test('level 1 is always unlocked', () => {
    expect(isLevelUnlocked(1, [])).toBe(true);
    expect(isLevelUnlocked(1, [2, 3])).toBe(true);
  });

  test('level 2 is locked when level 1 is not completed', () => {
    expect(isLevelUnlocked(2, [])).toBe(false);
  });

  test('level 2 is unlocked when level 1 is completed', () => {
    expect(isLevelUnlocked(2, [1])).toBe(true);
  });

  test('level 3 requires level 2 to be completed', () => {
    expect(isLevelUnlocked(3, [1])).toBe(false);
    expect(isLevelUnlocked(3, [1, 2])).toBe(true);
  });

  test('all levels unlocked for experienced skill level', () => {
    expect(isLevelUnlocked(2, [], 'experienced')).toBe(true);
    expect(isLevelUnlocked(5, [], 'experienced')).toBe(true);
  });

  test('experienced skill level does not affect level 1', () => {
    expect(isLevelUnlocked(1, [], 'beginner')).toBe(true);
  });
});

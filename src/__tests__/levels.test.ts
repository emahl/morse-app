import { TAPTYPE_DIT as DIT, TAPTYPE_DAH as DAH } from '../utility/constants';
import {
  LEVELS,
  sequenceToDisplay,
  isLevelUnlocked,
  LessonChallenge,
  InfoChallenge,
  MultipleChoiceChallenge,
  AudioCopyChallenge,
  MorseInputChallenge,
  WordInputChallenge,
} from '../data/levels';
import { getCharacterBySequence } from '../utility/morseTree';

describe('Level data integrity', () => {
  test('there are exactly 12 levels', () => {
    expect(LEVELS).toHaveLength(12);
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

  test('every level starts with a lesson or info challenge', () => {
    LEVELS.forEach((level) => {
      expect(['lesson', 'info']).toContain(level.challenges[0].type);
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

  describe('info challenges', () => {
    test('every info challenge has a non-empty title and body', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is InfoChallenge => c.type === 'info')
          .forEach((c) => {
            expect(c.title.length).toBeGreaterThan(0);
            expect(c.body.length).toBeGreaterThan(0);
          });
      });
    });
  });

  describe('audio-copy challenges', () => {
    test('every audio-copy has a sequence, correctAnswer, and 3 options including the answer', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is AudioCopyChallenge => c.type === 'audio-copy')
          .forEach((c) => {
            expect(c.sequence.length).toBeGreaterThan(0);
            expect(c.correctAnswer.length).toBeGreaterThan(0);
            expect(c.options).toHaveLength(3);
            expect(c.options).toContain(c.correctAnswer);
          });
      });
    });

    test('audio-copy sequence decodes to correctAnswer (for single-char challenges)', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is AudioCopyChallenge => c.type === 'audio-copy')
          .forEach((c) => {
            if (c.correctAnswer.length === 1) {
              expect(getCharacterBySequence(c.sequence)).toBe(c.correctAnswer);
            }
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

    test('when morseSequence is present it decodes to correctAnswer', () => {
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

  describe('word-input challenges', () => {
    test('each character\'s sequence decodes to its char', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is WordInputChallenge => c.type === 'word-input')
          .forEach((c) => {
            c.targetCharacters.forEach(({ char, sequence }) => {
              expect(getCharacterBySequence(sequence)).toBe(char);
            });
          });
      });
    });

    test('targetWord matches the concatenated target characters', () => {
      LEVELS.forEach((level) => {
        level.challenges
          .filter((c): c is WordInputChallenge => c.type === 'word-input')
          .forEach((c) => {
            const word = c.targetCharacters.map((tc) => tc.char).join('');
            expect(word).toBe(c.targetWord);
          });
      });
    });
  });

  describe('Level 1: E and T', () => {
    const level = LEVELS[0];
    test('has 6 challenges (2 lesson + 2 MC + 2 input)', () => {
      expect(level.challenges).toHaveLength(6);
    });
    test('teaches E and T', () => {
      const lessons = level.challenges.filter((c): c is LessonChallenge => c.type === 'lesson');
      expect(lessons.map((c) => c.character)).toEqual(expect.arrayContaining(['E', 'T']));
    });
  });

  describe('Level 2: I, A, N', () => {
    const level = LEVELS[1];
    test('has 9 challenges (3 lesson + 3 MC + 3 input)', () => {
      expect(level.challenges).toHaveLength(9);
    });
    test('teaches I, A, N', () => {
      const lessons = level.challenges.filter((c): c is LessonChallenge => c.type === 'lesson');
      expect(lessons.map((c) => c.character)).toEqual(expect.arrayContaining(['I', 'A', 'N']));
    });
  });

  describe('Level 3: SOS', () => {
    const level = LEVELS[2];
    test('has 7 challenges (2 lesson + 3 MC + 2 input)', () => {
      expect(level.challenges).toHaveLength(7);
    });
    test('teaches S and O', () => {
      const lessons = level.challenges.filter((c): c is LessonChallenge => c.type === 'lesson');
      expect(lessons.map((c) => c.character)).toEqual(expect.arrayContaining(['S', 'O']));
    });
  });

  describe('Level 4: ANT', () => {
    const level = LEVELS[3];
    test('has 7 challenges (3 lesson + 3 MC + 1 word-input)', () => {
      expect(level.challenges).toHaveLength(7);
    });
    test('has exactly one word-input challenge for ANT', () => {
      const wi = level.challenges.filter((c): c is WordInputChallenge => c.type === 'word-input');
      expect(wi).toHaveLength(1);
      expect(wi[0].targetWord).toBe('ANT');
    });
    test('word-input has characters A, N, T in order', () => {
      const wi = level.challenges.find((c): c is WordInputChallenge => c.type === 'word-input')!;
      expect(wi.targetCharacters.map((c) => c.char)).toEqual(['A', 'N', 'T']);
    });
  });

  describe('Level 5: Numbers 0–9', () => {
    const level = LEVELS[4];
    test('has 11 challenges (1 info + 4 lesson + 6 MC)', () => {
      expect(level.challenges).toHaveLength(11);
    });
    test('starts with an info challenge explaining the pattern', () => {
      expect(level.challenges[0].type).toBe('info');
      const info = level.challenges[0] as InfoChallenge;
      expect(info.body).toContain('5 signals');
    });
    test('teaches key pattern anchors: 1, 5, 0, 6', () => {
      const lessons = level.challenges.filter((c): c is LessonChallenge => c.type === 'lesson');
      expect(lessons.map((c) => c.character)).toEqual(expect.arrayContaining(['1', '5', '0', '6']));
    });
    test('all MC options are numbers only', () => {
      level.challenges
        .filter((c): c is MultipleChoiceChallenge => c.type === 'multiple-choice')
        .forEach((c) => {
          c.options.forEach((opt) => {
            expect(opt).toMatch(/^\d+$/);
          });
        });
    });
    test('MC covers both halves of the pattern', () => {
      const mc = level.challenges.filter(
        (c): c is MultipleChoiceChallenge => c.type === 'multiple-choice',
      );
      const answers = mc.map((c) => c.correctAnswer);
      expect(answers.some((a) => ['1', '2', '3', '4', '5'].includes(a))).toBe(true);
      expect(answers.some((a) => ['6', '7', '8', '9', '0'].includes(a))).toBe(true);
    });
  });
});

  describe('Levels 6–11: alphabet completion', () => {
    const newLevels = LEVELS.slice(5, 11); // levels 6-11 by index

    test('each level has lesson, audio-copy, and MC challenges', () => {
      newLevels.forEach((level) => {
        const types = new Set(level.challenges.map((c) => c.type));
        expect(types.has('lesson')).toBe(true);
        expect(types.has('audio-copy')).toBe(true);
        expect(types.has('multiple-choice')).toBe(true);
      });
    });

    test('every lesson in new levels decodes correctly', () => {
      newLevels.forEach((level) => {
        level.challenges
          .filter((c): c is LessonChallenge => c.type === 'lesson')
          .forEach((c) => {
            expect(getCharacterBySequence(c.sequence)).toBe(c.character);
          });
      });
    });

    test('all 26 letters are taught across levels 1-11', () => {
      const taught = new Set<string>();
      LEVELS.slice(0, 11).forEach((level) => {
        level.challenges
          .filter((c): c is LessonChallenge => c.type === 'lesson')
          .forEach((c) => { if (c.character.length === 1) taught.add(c.character); });
      });
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letter) => {
        expect(taught.has(letter)).toBe(true);
      });
    });
  });

  describe('Level 12: Q-codes', () => {
    const level = LEVELS[11];
    test('starts with an info challenge', () => {
      expect(level.challenges[0].type).toBe('info');
    });
    test('has MC challenges about Q-code meanings', () => {
      const mc = level.challenges.filter(
        (c): c is MultipleChoiceChallenge => c.type === 'multiple-choice',
      );
      expect(mc.length).toBeGreaterThan(0);
    });
  });

describe('sequenceToDisplay', () => {
  test('converts DIT to ·', () => { expect(sequenceToDisplay([DIT])).toBe('·'); });
  test('converts DAH to −', () => { expect(sequenceToDisplay([DAH])).toBe('−'); });
  test('separates elements with spaces', () => { expect(sequenceToDisplay([DIT, DAH])).toBe('· −'); });
  test('handles SOS sequence', () => {
    expect(sequenceToDisplay([DIT, DIT, DIT])).toBe('· · ·');
    expect(sequenceToDisplay([DAH, DAH, DAH])).toBe('− − −');
  });
  test('returns empty string for empty sequence', () => { expect(sequenceToDisplay([])).toBe(''); });
});

describe('isLevelUnlocked', () => {
  test('level 1 is always unlocked', () => {
    expect(isLevelUnlocked(1, [])).toBe(true);
    expect(isLevelUnlocked(1, [2, 3])).toBe(true);
  });
  test('level 2 locked without level 1 completed', () => { expect(isLevelUnlocked(2, [])).toBe(false); });
  test('level 2 unlocked when level 1 completed', () => { expect(isLevelUnlocked(2, [1])).toBe(true); });
  test('level 3 requires level 2', () => {
    expect(isLevelUnlocked(3, [1])).toBe(false);
    expect(isLevelUnlocked(3, [1, 2])).toBe(true);
  });
  test('experienced unlocks all levels', () => {
    expect(isLevelUnlocked(2, [], 'experienced')).toBe(true);
    expect(isLevelUnlocked(5, [], 'experienced')).toBe(true);
  });
});

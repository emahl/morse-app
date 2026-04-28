import { TAPTYPE_DIT as DIT, TAPTYPE_DAH as DAH, TapType } from '../utility/constants';

export type SkillLevel = 'beginner' | 'intermediate' | 'experienced';

// Convert a sequence to a display string e.g. [DIT, DAH] → "· −"
export function sequenceToDisplay(seq: TapType[]): string {
  return seq.map((t) => (t === DIT ? '·' : '−')).join(' ');
}

export interface LessonChallenge {
  type: 'lesson';
  id: string;
  character: string;
  sequence: TapType[];
  description: string;
}

export interface MultipleChoiceChallenge {
  type: 'multiple-choice';
  id: string;
  instruction: string;
  morseSequence?: TapType[];
  correctAnswer: string;
  options: [string, string, string];
}

export interface MorseInputChallenge {
  type: 'morse-input';
  id: string;
  instruction: string;
  targetCharacter: string;
  targetSequence: TapType[];
}

export type Challenge = LessonChallenge | MultipleChoiceChallenge | MorseInputChallenge;

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  milestone: string;
  challenges: Challenge[];
}

// ─── Level 1: SOS ────────────────────────────────────────────────────────────

const level1: Level = {
  id: 1,
  title: 'SOS',
  subtitle: 'The distress signal',
  milestone: '🆘 You know SOS — the universal distress signal, used worldwide since 1906.',
  challenges: [
    {
      type: 'lesson',
      id: '1-0',
      character: 'S',
      sequence: [DIT, DIT, DIT],
      description: 'Three quick taps',
    },
    {
      type: 'lesson',
      id: '1-1',
      character: 'O',
      sequence: [DAH, DAH, DAH],
      description: 'Three long holds',
    },
    {
      type: 'multiple-choice',
      id: '1-2',
      instruction: 'What letter is this?',
      morseSequence: [DIT, DIT, DIT],
      correctAnswer: 'S',
      options: ['S', 'O', 'E'],
    },
    {
      type: 'multiple-choice',
      id: '1-3',
      instruction: 'What letter is this?',
      morseSequence: [DAH, DAH, DAH],
      correctAnswer: 'O',
      options: ['A', 'O', 'M'],
    },
    {
      type: 'multiple-choice',
      id: '1-4',
      instruction: 'S · · ·   O − − −   S · · ·\nWhat distress signal is this?',
      correctAnswer: 'SOS',
      options: ['SOS', 'ABC', 'IDS'],
    },
    {
      type: 'morse-input',
      id: '1-5',
      instruction: 'Tap the morse code for  S',
      targetCharacter: 'S',
      targetSequence: [DIT, DIT, DIT],
    },
    {
      type: 'morse-input',
      id: '1-6',
      instruction: 'Tap the morse code for  O',
      targetCharacter: 'O',
      targetSequence: [DAH, DAH, DAH],
    },
  ],
};

// ─── Level 2: E and T ─────────────────────────────────────────────────────────

const level2: Level = {
  id: 2,
  title: 'E and T',
  subtitle: 'The simplest letters',
  milestone: '⚡ E and T — the two simplest morse letters. Short and sharp.',
  challenges: [
    {
      type: 'lesson',
      id: '2-0',
      character: 'E',
      sequence: [DIT],
      description: 'One short tap',
    },
    {
      type: 'lesson',
      id: '2-1',
      character: 'T',
      sequence: [DAH],
      description: 'One long hold',
    },
    {
      type: 'multiple-choice',
      id: '2-2',
      instruction: 'What letter is this?',
      morseSequence: [DIT],
      correctAnswer: 'E',
      options: ['E', 'I', 'S'],
    },
    {
      type: 'multiple-choice',
      id: '2-3',
      instruction: 'What letter is this?',
      morseSequence: [DAH],
      correctAnswer: 'T',
      options: ['T', 'M', 'O'],
    },
    {
      type: 'morse-input',
      id: '2-4',
      instruction: 'Tap the morse code for  E',
      targetCharacter: 'E',
      targetSequence: [DIT],
    },
    {
      type: 'morse-input',
      id: '2-5',
      instruction: 'Tap the morse code for  T',
      targetCharacter: 'T',
      targetSequence: [DAH],
    },
  ],
};

// ─── Level 3: I, A, N ─────────────────────────────────────────────────────────

const level3: Level = {
  id: 3,
  title: 'I, A, N',
  subtitle: 'Building words',
  milestone: '🌟 I, A, N — you can already spell TITAN, SAINT, and ANTENNA!',
  challenges: [
    {
      type: 'lesson',
      id: '3-0',
      character: 'I',
      sequence: [DIT, DIT],
      description: 'Two quick taps',
    },
    {
      type: 'lesson',
      id: '3-1',
      character: 'A',
      sequence: [DIT, DAH],
      description: 'Short then long',
    },
    {
      type: 'lesson',
      id: '3-2',
      character: 'N',
      sequence: [DAH, DIT],
      description: 'Long then short',
    },
    {
      type: 'multiple-choice',
      id: '3-3',
      instruction: 'What letter is this?',
      morseSequence: [DIT, DIT],
      correctAnswer: 'I',
      options: ['I', 'E', 'S'],
    },
    {
      type: 'multiple-choice',
      id: '3-4',
      instruction: 'What letter is this?',
      morseSequence: [DIT, DAH],
      correctAnswer: 'A',
      options: ['A', 'U', 'W'],
    },
    {
      type: 'multiple-choice',
      id: '3-5',
      instruction: 'What letter is this?',
      morseSequence: [DAH, DIT],
      correctAnswer: 'N',
      options: ['N', 'D', 'K'],
    },
    {
      type: 'morse-input',
      id: '3-6',
      instruction: 'Tap the morse code for  I',
      targetCharacter: 'I',
      targetSequence: [DIT, DIT],
    },
    {
      type: 'morse-input',
      id: '3-7',
      instruction: 'Tap the morse code for  A',
      targetCharacter: 'A',
      targetSequence: [DIT, DAH],
    },
    {
      type: 'morse-input',
      id: '3-8',
      instruction: 'Tap the morse code for  N',
      targetCharacter: 'N',
      targetSequence: [DAH, DIT],
    },
  ],
};

// ─── Level 4: M, R, U ─────────────────────────────────────────────────────────

const level4: Level = {
  id: 4,
  title: 'M, R, U',
  subtitle: 'More letters',
  milestone: '📡 M, R, U — you are building real morse vocabulary!',
  challenges: [
    {
      type: 'lesson',
      id: '4-0',
      character: 'M',
      sequence: [DAH, DAH],
      description: 'Two long holds',
    },
    {
      type: 'lesson',
      id: '4-1',
      character: 'R',
      sequence: [DIT, DAH, DIT],
      description: 'Short – long – short',
    },
    {
      type: 'lesson',
      id: '4-2',
      character: 'U',
      sequence: [DIT, DIT, DAH],
      description: 'Two short, one long',
    },
    {
      type: 'multiple-choice',
      id: '4-3',
      instruction: 'What letter is this?',
      morseSequence: [DAH, DAH],
      correctAnswer: 'M',
      options: ['M', 'O', 'G'],
    },
    {
      type: 'multiple-choice',
      id: '4-4',
      instruction: 'What letter is this?',
      morseSequence: [DIT, DAH, DIT],
      correctAnswer: 'R',
      options: ['R', 'K', 'C'],
    },
    {
      type: 'multiple-choice',
      id: '4-5',
      instruction: 'What letter is this?',
      morseSequence: [DIT, DIT, DAH],
      correctAnswer: 'U',
      options: ['U', 'V', 'F'],
    },
    {
      type: 'morse-input',
      id: '4-6',
      instruction: 'Tap the morse code for  M',
      targetCharacter: 'M',
      targetSequence: [DAH, DAH],
    },
    {
      type: 'morse-input',
      id: '4-7',
      instruction: 'Tap the morse code for  R',
      targetCharacter: 'R',
      targetSequence: [DIT, DAH, DIT],
    },
    {
      type: 'morse-input',
      id: '4-8',
      instruction: 'Tap the morse code for  U',
      targetCharacter: 'U',
      targetSequence: [DIT, DIT, DAH],
    },
  ],
};

// ─── Level 5: Numbers 1–3 ────────────────────────────────────────────────────

const level5: Level = {
  id: 5,
  title: 'Numbers',
  subtitle: 'Morse digits 1–3',
  milestone: '🔢 Numbers too — you can now signal positions and counts!',
  challenges: [
    {
      type: 'lesson',
      id: '5-0',
      character: '1',
      sequence: [DIT, DAH, DAH, DAH, DAH],
      description: 'One dot, four dashes',
    },
    {
      type: 'lesson',
      id: '5-1',
      character: '2',
      sequence: [DIT, DIT, DAH, DAH, DAH],
      description: 'Two dots, three dashes',
    },
    {
      type: 'lesson',
      id: '5-2',
      character: '3',
      sequence: [DIT, DIT, DIT, DAH, DAH],
      description: 'Three dots, two dashes',
    },
    {
      type: 'multiple-choice',
      id: '5-3',
      instruction: 'What number is this?',
      morseSequence: [DIT, DAH, DAH, DAH, DAH],
      correctAnswer: '1',
      options: ['1', '6', 'J'],
    },
    {
      type: 'multiple-choice',
      id: '5-4',
      instruction: 'What number is this?',
      morseSequence: [DIT, DIT, DAH, DAH, DAH],
      correctAnswer: '2',
      options: ['2', '7', 'U'],
    },
    {
      type: 'multiple-choice',
      id: '5-5',
      instruction: 'What number is this?',
      morseSequence: [DIT, DIT, DIT, DAH, DAH],
      correctAnswer: '3',
      options: ['3', '8', 'V'],
    },
  ],
};

export const LEVELS: Level[] = [level1, level2, level3, level4, level5];

export function isLevelUnlocked(
  levelId: number,
  completedLevelIds: number[],
  skillLevel?: SkillLevel | null,
): boolean {
  if (levelId === 1) return true;
  if (skillLevel === 'experienced') return true;
  return completedLevelIds.includes(levelId - 1);
}

import { TAPTYPE_DIT as DIT, TAPTYPE_DAH as DAH, TapType } from '../utility/constants';

export type SkillLevel = 'beginner' | 'intermediate' | 'experienced';

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

export interface InfoChallenge {
  type: 'info';
  id: string;
  title: string;
  body: string;
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

export interface AudioCopyChallenge {
  type: 'audio-copy';
  id: string;
  sequence: TapType[];
  correctAnswer: string;
  options: [string, string, string];
}

export interface WordInputChallenge {
  type: 'word-input';
  id: string;
  instruction: string;
  targetWord: string;
  targetCharacters: Array<{ char: string; sequence: TapType[] }>;
}

export type Challenge =
  | LessonChallenge
  | InfoChallenge
  | MultipleChoiceChallenge
  | AudioCopyChallenge
  | MorseInputChallenge
  | WordInputChallenge;

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  milestone: string;
  challenges: Challenge[];
}

// ─── Level 1: E and T ─────────────────────────────────────────────────────────

const level1: Level = {
  id: 1,
  title: 'E and T',
  subtitle: 'The simplest signals',
  milestone: '⚡ E and T — the two simplest morse letters. Just one signal each.',
  challenges: [
    { type: 'lesson', id: '1-0', character: 'E', sequence: [DIT], description: 'One short tap' },
    { type: 'lesson', id: '1-1', character: 'T', sequence: [DAH], description: 'One long hold' },
    {
      type: 'multiple-choice', id: '1-2', instruction: 'What letter is this?',
      morseSequence: [DIT], correctAnswer: 'E', options: ['E', 'I', 'S'],
    },
    {
      type: 'multiple-choice', id: '1-3', instruction: 'What letter is this?',
      morseSequence: [DAH], correctAnswer: 'T', options: ['T', 'M', 'O'],
    },
    { type: 'morse-input', id: '1-4', instruction: 'Tap the morse code for  E', targetCharacter: 'E', targetSequence: [DIT] },
    { type: 'morse-input', id: '1-5', instruction: 'Tap the morse code for  T', targetCharacter: 'T', targetSequence: [DAH] },
  ],
};

// ─── Level 2: I, A, N ─────────────────────────────────────────────────────────

const level2: Level = {
  id: 2,
  title: 'I, A, N',
  subtitle: 'Two-signal letters',
  milestone: '🌟 I, A, N — you can already spell TITAN, SAINT, and ANTENNA!',
  challenges: [
    { type: 'lesson', id: '2-0', character: 'I', sequence: [DIT, DIT], description: 'Two quick taps' },
    { type: 'lesson', id: '2-1', character: 'A', sequence: [DIT, DAH], description: 'Short then long' },
    { type: 'lesson', id: '2-2', character: 'N', sequence: [DAH, DIT], description: 'Long then short' },
    {
      type: 'multiple-choice', id: '2-3', instruction: 'What letter is this?',
      morseSequence: [DIT, DIT], correctAnswer: 'I', options: ['I', 'E', 'S'],
    },
    {
      type: 'multiple-choice', id: '2-4', instruction: 'What letter is this?',
      morseSequence: [DIT, DAH], correctAnswer: 'A', options: ['A', 'U', 'W'],
    },
    {
      type: 'multiple-choice', id: '2-5', instruction: 'What letter is this?',
      morseSequence: [DAH, DIT], correctAnswer: 'N', options: ['N', 'D', 'K'],
    },
    { type: 'morse-input', id: '2-6', instruction: 'Tap the morse code for  I', targetCharacter: 'I', targetSequence: [DIT, DIT] },
    { type: 'morse-input', id: '2-7', instruction: 'Tap the morse code for  A', targetCharacter: 'A', targetSequence: [DIT, DAH] },
    { type: 'morse-input', id: '2-8', instruction: 'Tap the morse code for  N', targetCharacter: 'N', targetSequence: [DAH, DIT] },
  ],
};

// ─── Level 3: SOS ────────────────────────────────────────────────────────────

const level3: Level = {
  id: 3,
  title: 'SOS',
  subtitle: 'The distress signal',
  milestone: '🆘 You know SOS — the universal distress signal, used worldwide since 1906.',
  challenges: [
    { type: 'lesson', id: '3-0', character: 'S', sequence: [DIT, DIT, DIT], description: 'Three quick taps' },
    { type: 'lesson', id: '3-1', character: 'O', sequence: [DAH, DAH, DAH], description: 'Three long holds' },
    {
      type: 'multiple-choice', id: '3-2', instruction: 'What letter is this?',
      morseSequence: [DIT, DIT, DIT], correctAnswer: 'S', options: ['S', 'O', 'E'],
    },
    {
      type: 'multiple-choice', id: '3-3', instruction: 'What letter is this?',
      morseSequence: [DAH, DAH, DAH], correctAnswer: 'O', options: ['A', 'O', 'M'],
    },
    {
      type: 'multiple-choice', id: '3-4',
      instruction: '· · ·   − − −   · · ·\nWhat distress signal is this?',
      correctAnswer: 'SOS', options: ['SOS', 'ABC', 'IDS'],
    },
    { type: 'morse-input', id: '3-5', instruction: 'Tap the morse code for  S', targetCharacter: 'S', targetSequence: [DIT, DIT, DIT] },
    { type: 'morse-input', id: '3-6', instruction: 'Tap the morse code for  O', targetCharacter: 'O', targetSequence: [DAH, DAH, DAH] },
  ],
};

// ─── Level 4: ANT — spell your first word ────────────────────────────────────

const level4: Level = {
  id: 4,
  title: 'ANT',
  subtitle: 'Spell your first word',
  milestone: '🐜 ANT in morse: · −  − ·  −   You can also spell TAN, TIN, and TITAN!',
  challenges: [
    { type: 'lesson', id: '4-0', character: 'A', sequence: [DIT, DAH], description: 'Short then long' },
    { type: 'lesson', id: '4-1', character: 'N', sequence: [DAH, DIT], description: 'Long then short' },
    { type: 'lesson', id: '4-2', character: 'T', sequence: [DAH], description: 'One long hold' },
    {
      type: 'multiple-choice', id: '4-3', instruction: 'What letter is this?',
      morseSequence: [DIT, DAH], correctAnswer: 'A', options: ['A', 'U', 'W'],
    },
    {
      type: 'multiple-choice', id: '4-4', instruction: 'What letter is this?',
      morseSequence: [DAH, DIT], correctAnswer: 'N', options: ['N', 'K', 'D'],
    },
    {
      type: 'multiple-choice', id: '4-5', instruction: 'What letter is this?',
      morseSequence: [DAH], correctAnswer: 'T', options: ['T', 'M', 'O'],
    },
    {
      type: 'word-input',
      id: '4-6',
      instruction: 'Now spell  ANT  in morse — tap all three letters in a row',
      targetWord: 'ANT',
      targetCharacters: [
        { char: 'A', sequence: [DIT, DAH] },
        { char: 'N', sequence: [DAH, DIT] },
        { char: 'T', sequence: [DAH] },
      ],
    },
  ],
};

// ─── Level 5: Numbers 0–9 ─────────────────────────────────────────────────────

const NUMBER_PATTERN_BODY =
  'Every number is exactly 5 signals.\n\n' +
  '1 → 5  grow in dots:\n' +
  '1  · − − − −\n' +
  '2  · · − − −\n' +
  '3  · · · − −\n' +
  '4  · · · · −\n' +
  '5  · · · · ·\n\n' +
  '6 → 0  flip it — grow in dashes:\n' +
  '6  − · · · ·\n' +
  '7  − − · · ·\n' +
  '8  − − − · ·\n' +
  '9  − − − − ·\n' +
  '0  − − − − −';

const level5: Level = {
  id: 5,
  title: 'Numbers 0 – 9',
  subtitle: 'Five signals, one pattern',
  milestone: '🔢 Numbers cracked! 1–5 grow in dots, 6–0 grow in dashes. Five signals every time.',
  challenges: [
    {
      type: 'info',
      id: '5-0',
      title: 'The Number Pattern',
      body: NUMBER_PATTERN_BODY,
    },
    { type: 'lesson', id: '5-1', character: '1', sequence: [DIT, DAH, DAH, DAH, DAH], description: 'One dot, four dashes — the pattern begins' },
    { type: 'lesson', id: '5-2', character: '5', sequence: [DIT, DIT, DIT, DIT, DIT], description: 'Five dots — the midpoint, no dashes' },
    { type: 'lesson', id: '5-3', character: '0', sequence: [DAH, DAH, DAH, DAH, DAH], description: 'Five dashes — the endpoint, no dots' },
    { type: 'lesson', id: '5-4', character: '6', sequence: [DAH, DIT, DIT, DIT, DIT], description: 'One dash, four dots — mirror of 1' },
    {
      type: 'multiple-choice', id: '5-5', instruction: 'What number is this?',
      morseSequence: [DIT, DAH, DAH, DAH, DAH], correctAnswer: '1', options: ['1', '6', '9'],
    },
    {
      type: 'multiple-choice', id: '5-6', instruction: 'What number is this?',
      morseSequence: [DIT, DIT, DIT, DAH, DAH], correctAnswer: '3', options: ['3', '8', '2'],
    },
    {
      type: 'multiple-choice', id: '5-7', instruction: 'What number is this?',
      morseSequence: [DIT, DIT, DIT, DIT, DIT], correctAnswer: '5', options: ['5', '0', '3'],
    },
    {
      type: 'multiple-choice', id: '5-8', instruction: 'What number is this?',
      morseSequence: [DAH, DIT, DIT, DIT, DIT], correctAnswer: '6', options: ['6', '1', '4'],
    },
    {
      type: 'multiple-choice', id: '5-9', instruction: 'What number is this?',
      morseSequence: [DAH, DAH, DAH, DIT, DIT], correctAnswer: '8', options: ['8', '3', '7'],
    },
    {
      type: 'multiple-choice', id: '5-10', instruction: 'What number is this?',
      morseSequence: [DAH, DAH, DAH, DAH, DAH], correctAnswer: '0', options: ['0', '5', '9'],
    },
  ],
};

// ─── Level 6: D, U, R ────────────────────────────────────────────────────────

const level6: Level = {
  id: 6,
  title: 'D, U, R',
  subtitle: 'Three new letters',
  milestone: '🔤 D, U, R — you can spell RUIN, TURN, DARN, and over a hundred more words!',
  challenges: [
    { type: 'lesson', id: '6-0', character: 'D', sequence: [DAH, DIT, DIT], description: 'Long then two short' },
    { type: 'lesson', id: '6-1', character: 'U', sequence: [DIT, DIT, DAH], description: 'Two short then long' },
    { type: 'lesson', id: '6-2', character: 'R', sequence: [DIT, DAH, DIT], description: 'Short – long – short' },
    { type: 'audio-copy', id: '6-3', sequence: [DAH, DIT, DIT], correctAnswer: 'D', options: ['D', 'N', 'B'] },
    { type: 'audio-copy', id: '6-4', sequence: [DIT, DIT, DAH], correctAnswer: 'U', options: ['U', 'I', 'W'] },
    { type: 'audio-copy', id: '6-5', sequence: [DIT, DAH, DIT], correctAnswer: 'R', options: ['R', 'A', 'L'] },
    { type: 'multiple-choice', id: '6-6', instruction: 'What letter is this?', morseSequence: [DAH, DIT, DIT], correctAnswer: 'D', options: ['D', 'N', 'B'] },
    { type: 'multiple-choice', id: '6-7', instruction: 'What letter is this?', morseSequence: [DIT, DIT, DAH], correctAnswer: 'U', options: ['U', 'I', 'W'] },
    { type: 'multiple-choice', id: '6-8', instruction: 'What letter is this?', morseSequence: [DIT, DAH, DIT], correctAnswer: 'R', options: ['R', 'A', 'L'] },
    { type: 'morse-input', id: '6-9', instruction: 'Tap the morse code for  D', targetCharacter: 'D', targetSequence: [DAH, DIT, DIT] },
    { type: 'morse-input', id: '6-10', instruction: 'Tap the morse code for  U', targetCharacter: 'U', targetSequence: [DIT, DIT, DAH] },
    { type: 'morse-input', id: '6-11', instruction: 'Tap the morse code for  R', targetCharacter: 'R', targetSequence: [DIT, DAH, DIT] },
  ],
};

// ─── Level 7: G, M, W ────────────────────────────────────────────────────────

const level7: Level = {
  id: 7,
  title: 'G, M, W',
  subtitle: 'More letters',
  milestone: '🔤 G, M, W — try: WARM, GRIM, SWING, GROWN!',
  challenges: [
    { type: 'lesson', id: '7-0', character: 'G', sequence: [DAH, DAH, DIT], description: 'Two long then short' },
    { type: 'lesson', id: '7-1', character: 'M', sequence: [DAH, DAH], description: 'Two long holds' },
    { type: 'lesson', id: '7-2', character: 'W', sequence: [DIT, DAH, DAH], description: 'Short then two long' },
    { type: 'audio-copy', id: '7-3', sequence: [DAH, DAH, DIT], correctAnswer: 'G', options: ['G', 'M', 'O'] },
    { type: 'audio-copy', id: '7-4', sequence: [DAH, DAH], correctAnswer: 'M', options: ['M', 'T', 'O'] },
    { type: 'audio-copy', id: '7-5', sequence: [DIT, DAH, DAH], correctAnswer: 'W', options: ['W', 'A', 'U'] },
    { type: 'multiple-choice', id: '7-6', instruction: 'What letter is this?', morseSequence: [DAH, DAH, DIT], correctAnswer: 'G', options: ['G', 'M', 'O'] },
    { type: 'multiple-choice', id: '7-7', instruction: 'What letter is this?', morseSequence: [DAH, DAH], correctAnswer: 'M', options: ['M', 'T', 'O'] },
    { type: 'multiple-choice', id: '7-8', instruction: 'What letter is this?', morseSequence: [DIT, DAH, DAH], correctAnswer: 'W', options: ['W', 'A', 'U'] },
    { type: 'morse-input', id: '7-9', instruction: 'Tap the morse code for  G', targetCharacter: 'G', targetSequence: [DAH, DAH, DIT] },
    { type: 'morse-input', id: '7-10', instruction: 'Tap the morse code for  M', targetCharacter: 'M', targetSequence: [DAH, DAH] },
    { type: 'morse-input', id: '7-11', instruction: 'Tap the morse code for  W', targetCharacter: 'W', targetSequence: [DIT, DAH, DAH] },
  ],
};

// ─── Level 8: H, B, L ────────────────────────────────────────────────────────

const level8: Level = {
  id: 8,
  title: 'H, B, L',
  subtitle: 'Four-signal letters',
  milestone: '🔤 H, B, L — you\'re past halfway through the alphabet!',
  challenges: [
    { type: 'lesson', id: '8-0', character: 'H', sequence: [DIT, DIT, DIT, DIT], description: 'Four quick taps' },
    { type: 'lesson', id: '8-1', character: 'B', sequence: [DAH, DIT, DIT, DIT], description: 'Long then three short' },
    { type: 'lesson', id: '8-2', character: 'L', sequence: [DIT, DAH, DIT, DIT], description: 'Short – long – two short' },
    { type: 'audio-copy', id: '8-3', sequence: [DIT, DIT, DIT, DIT], correctAnswer: 'H', options: ['H', 'S', 'V'] },
    { type: 'audio-copy', id: '8-4', sequence: [DAH, DIT, DIT, DIT], correctAnswer: 'B', options: ['B', 'D', 'X'] },
    { type: 'audio-copy', id: '8-5', sequence: [DIT, DAH, DIT, DIT], correctAnswer: 'L', options: ['L', 'R', 'F'] },
    { type: 'multiple-choice', id: '8-6', instruction: 'What letter is this?', morseSequence: [DIT, DIT, DIT, DIT], correctAnswer: 'H', options: ['H', 'S', 'V'] },
    { type: 'multiple-choice', id: '8-7', instruction: 'What letter is this?', morseSequence: [DAH, DIT, DIT, DIT], correctAnswer: 'B', options: ['B', 'D', 'X'] },
    { type: 'multiple-choice', id: '8-8', instruction: 'What letter is this?', morseSequence: [DIT, DAH, DIT, DIT], correctAnswer: 'L', options: ['L', 'R', 'F'] },
    { type: 'morse-input', id: '8-9', instruction: 'Tap the morse code for  H', targetCharacter: 'H', targetSequence: [DIT, DIT, DIT, DIT] },
    { type: 'morse-input', id: '8-10', instruction: 'Tap the morse code for  B', targetCharacter: 'B', targetSequence: [DAH, DIT, DIT, DIT] },
    { type: 'morse-input', id: '8-11', instruction: 'Tap the morse code for  L', targetCharacter: 'L', targetSequence: [DIT, DAH, DIT, DIT] },
  ],
};

// ─── Level 9: F, C, K ────────────────────────────────────────────────────────

const level9: Level = {
  id: 9,
  title: 'F, C, K',
  subtitle: 'More four-signal letters',
  milestone: '🔤 F, C, K — FACT, CRACK, FOLK! Nearly there.',
  challenges: [
    { type: 'lesson', id: '9-0', character: 'F', sequence: [DIT, DIT, DAH, DIT], description: 'Two short – long – short' },
    { type: 'lesson', id: '9-1', character: 'C', sequence: [DAH, DIT, DAH, DIT], description: 'Alternating: long – short – long – short' },
    { type: 'lesson', id: '9-2', character: 'K', sequence: [DAH, DIT, DAH], description: 'Long – short – long' },
    { type: 'audio-copy', id: '9-3', sequence: [DIT, DIT, DAH, DIT], correctAnswer: 'F', options: ['F', 'L', 'P'] },
    { type: 'audio-copy', id: '9-4', sequence: [DAH, DIT, DAH, DIT], correctAnswer: 'C', options: ['C', 'K', 'X'] },
    { type: 'audio-copy', id: '9-5', sequence: [DAH, DIT, DAH], correctAnswer: 'K', options: ['K', 'C', 'R'] },
    { type: 'multiple-choice', id: '9-6', instruction: 'What letter is this?', morseSequence: [DIT, DIT, DAH, DIT], correctAnswer: 'F', options: ['F', 'L', 'P'] },
    { type: 'multiple-choice', id: '9-7', instruction: 'What letter is this?', morseSequence: [DAH, DIT, DAH, DIT], correctAnswer: 'C', options: ['C', 'K', 'X'] },
    { type: 'multiple-choice', id: '9-8', instruction: 'What letter is this?', morseSequence: [DAH, DIT, DAH], correctAnswer: 'K', options: ['K', 'C', 'R'] },
    { type: 'morse-input', id: '9-9', instruction: 'Tap the morse code for  F', targetCharacter: 'F', targetSequence: [DIT, DIT, DAH, DIT] },
    { type: 'morse-input', id: '9-10', instruction: 'Tap the morse code for  C', targetCharacter: 'C', targetSequence: [DAH, DIT, DAH, DIT] },
    { type: 'morse-input', id: '9-11', instruction: 'Tap the morse code for  K', targetCharacter: 'K', targetSequence: [DAH, DIT, DAH] },
  ],
};

// ─── Level 10: V, P, J, Y ────────────────────────────────────────────────────

const level10: Level = {
  id: 10,
  title: 'V, P, J, Y',
  subtitle: 'Four more letters',
  milestone: '🔤 V, P, J, Y — only Q, X, Z left. You\'re almost there!',
  challenges: [
    { type: 'lesson', id: '10-0', character: 'V', sequence: [DIT, DIT, DIT, DAH], description: 'Three short then long — V for Victory!' },
    { type: 'lesson', id: '10-1', character: 'P', sequence: [DIT, DAH, DAH, DIT], description: 'Short – two long – short' },
    { type: 'lesson', id: '10-2', character: 'J', sequence: [DIT, DAH, DAH, DAH], description: 'Short then three long' },
    { type: 'lesson', id: '10-3', character: 'Y', sequence: [DAH, DIT, DAH, DAH], description: 'Long – short – two long' },
    { type: 'audio-copy', id: '10-4', sequence: [DIT, DIT, DIT, DAH], correctAnswer: 'V', options: ['V', 'H', 'U'] },
    { type: 'audio-copy', id: '10-5', sequence: [DIT, DAH, DAH, DIT], correctAnswer: 'P', options: ['P', 'W', 'L'] },
    { type: 'audio-copy', id: '10-6', sequence: [DIT, DAH, DAH, DAH], correctAnswer: 'J', options: ['J', 'W', 'Y'] },
    { type: 'audio-copy', id: '10-7', sequence: [DAH, DIT, DAH, DAH], correctAnswer: 'Y', options: ['Y', 'K', 'Q'] },
    { type: 'multiple-choice', id: '10-8', instruction: 'What letter is this?', morseSequence: [DIT, DIT, DIT, DAH], correctAnswer: 'V', options: ['V', 'H', 'U'] },
    { type: 'multiple-choice', id: '10-9', instruction: 'What letter is this?', morseSequence: [DIT, DAH, DAH, DIT], correctAnswer: 'P', options: ['P', 'W', 'L'] },
    { type: 'multiple-choice', id: '10-10', instruction: 'What letter is this?', morseSequence: [DIT, DAH, DAH, DAH], correctAnswer: 'J', options: ['J', 'W', 'Y'] },
    { type: 'multiple-choice', id: '10-11', instruction: 'What letter is this?', morseSequence: [DAH, DIT, DAH, DAH], correctAnswer: 'Y', options: ['Y', 'K', 'Q'] },
  ],
};

// ─── Level 11: Q, X, Z — completing the alphabet ─────────────────────────────

const level11: Level = {
  id: 11,
  title: 'Q, X, Z',
  subtitle: 'The final three letters',
  milestone: '🏆 You know the entire morse alphabet — all 26 letters! You\'re a morse operator.',
  challenges: [
    { type: 'lesson', id: '11-0', character: 'Q', sequence: [DAH, DAH, DIT, DAH], description: 'Two long – short – long' },
    { type: 'lesson', id: '11-1', character: 'X', sequence: [DAH, DIT, DIT, DAH], description: 'Long – two short – long' },
    { type: 'lesson', id: '11-2', character: 'Z', sequence: [DAH, DAH, DIT, DIT], description: 'Two long then two short' },
    { type: 'audio-copy', id: '11-3', sequence: [DAH, DAH, DIT, DAH], correctAnswer: 'Q', options: ['Q', 'Y', 'G'] },
    { type: 'audio-copy', id: '11-4', sequence: [DAH, DIT, DIT, DAH], correctAnswer: 'X', options: ['X', 'B', 'D'] },
    { type: 'audio-copy', id: '11-5', sequence: [DAH, DAH, DIT, DIT], correctAnswer: 'Z', options: ['Z', 'G', 'Q'] },
    { type: 'multiple-choice', id: '11-6', instruction: 'What letter is this?', morseSequence: [DAH, DAH, DIT, DAH], correctAnswer: 'Q', options: ['Q', 'Y', 'G'] },
    { type: 'multiple-choice', id: '11-7', instruction: 'What letter is this?', morseSequence: [DAH, DIT, DIT, DAH], correctAnswer: 'X', options: ['X', 'B', 'D'] },
    { type: 'multiple-choice', id: '11-8', instruction: 'What letter is this?', morseSequence: [DAH, DAH, DIT, DIT], correctAnswer: 'Z', options: ['Z', 'G', 'Q'] },
    { type: 'morse-input', id: '11-9', instruction: 'Tap the morse code for  Q', targetCharacter: 'Q', targetSequence: [DAH, DAH, DIT, DAH] },
    { type: 'morse-input', id: '11-10', instruction: 'Tap the morse code for  X', targetCharacter: 'X', targetSequence: [DAH, DIT, DIT, DAH] },
    { type: 'morse-input', id: '11-11', instruction: 'Tap the morse code for  Z', targetCharacter: 'Z', targetSequence: [DAH, DAH, DIT, DIT] },
  ],
};

// ─── Level 12: Q-codes & prosigns ────────────────────────────────────────────
//
// These are the standard abbreviations every radio operator uses.
// Sequences are the concatenated morse (character gaps not represented).

const level12: Level = {
  id: 12,
  title: 'Q-Codes',
  subtitle: 'Radio operator language',
  milestone: '📡 CQ DE you! You\'re ready for the airwaves. 73!',
  challenges: [
    {
      type: 'info',
      id: '12-0',
      title: 'Radio Operator Language',
      body:
        'Real morse operators use short codes that carry full meanings.\n\n' +
        'CQ  −·−· −−·−  "Calling all stations"\n' +
        'DE  −·· ·  "From" (used before your callsign)\n' +
        '73  −−··· −−−··  "Best regards"\n' +
        'AR  ·−·−·  End of message\n' +
        'SK  ···−·−  End of contact (sign-off)\n\n' +
        'A typical contact ends:\n' +
        '"73 AR SK"  —  Best regards, message over, signing off.',
    },
    // Lesson cards for each code
    { type: 'lesson', id: '12-1', character: 'C', sequence: [DAH, DIT, DAH, DIT], description: 'C in CQ — Calling...' },
    { type: 'lesson', id: '12-2', character: 'Q', sequence: [DAH, DAH, DIT, DAH], description: 'Q in CQ — ...all stations' },
    { type: 'lesson', id: '12-3', character: 'D', sequence: [DAH, DIT, DIT], description: 'D in DE — From...' },
    // Audio-copy: identify the code
    {
      type: 'audio-copy', id: '12-4',
      sequence: [DAH, DIT, DIT, DIT],   // B
      correctAnswer: 'B', options: ['B', 'D', 'N'],
    },
    {
      type: 'audio-copy', id: '12-5',
      sequence: [DAH, DAH, DIT],         // G
      correctAnswer: 'G', options: ['G', 'M', 'W'],
    },
    // MC: identify the meaning of common codes
    {
      type: 'multiple-choice', id: '12-6',
      instruction: 'In morse radio, what does "73" mean?',
      correctAnswer: 'Best regards',
      options: ['Best regards', 'End of message', 'Calling all stations'],
    },
    {
      type: 'multiple-choice', id: '12-7',
      instruction: 'What does "CQ" mean?',
      correctAnswer: 'Calling all stations',
      options: ['Calling all stations', 'Come quickly', 'Best regards'],
    },
    {
      type: 'multiple-choice', id: '12-8',
      instruction: 'In "W1ABC DE W2XYZ", what does "DE" mean?',
      correctAnswer: 'From',
      options: ['From', 'Distress emergency', 'Done, end'],
    },
    {
      type: 'multiple-choice', id: '12-9',
      instruction: 'What is "SK" used for?',
      correctAnswer: 'End of contact',
      options: ['End of contact', 'Seek help', 'Standing by'],
    },
  ],
};

export const LEVELS: Level[] = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12];

export function isLevelUnlocked(
  levelId: number,
  completedLevelIds: number[],
  skillLevel?: SkillLevel | null,
): boolean {
  if (levelId === 1) return true;
  if (skillLevel === 'experienced') return true;
  return completedLevelIds.includes(levelId - 1);
}

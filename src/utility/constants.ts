export const TAPTYPE_DIT = 1;
export const TAPTYPE_DAH = 2;

export type TapType = typeof TAPTYPE_DIT | typeof TAPTYPE_DAH;

export const CHARACTER_DELAY_DURATION = 800; // ms
export const DIT_DURATION = 150; // ms
export const DAH_DURATION = 450; // ms — ITU standard: dah = 3× dit
export const PRESS_DURATION_THRESHOLD = 250; // ms — tap under 250ms = dit, hold over = dah

export const ORIGINAL_MESSAGE = '[What hath God wrought?]';

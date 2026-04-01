export const TAPTYPE_DIT = 1;
export const TAPTYPE_DAH = 2;

export type TapType = typeof TAPTYPE_DIT | typeof TAPTYPE_DAH;

export const CHARACTER_DELAY_DURATION = 800; // ms
export const DIT_DURATION = 150; // ms
export const DAH_DURATION = 300; // ms
export const PRESS_DURATION_THRESHOLD = 150; // ms - above this is a dah, below is a dit

export const ORIGINAL_MESSAGE = '[What hath God wrought?]';

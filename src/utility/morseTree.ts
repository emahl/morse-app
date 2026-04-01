import { TAPTYPE_DIT, TAPTYPE_DAH, TapType } from './constants';

interface MorseNode {
  text: string;
  left: MorseNode | null;
  right: MorseNode | null;
}

/**
 * Get a character from a morse code sequence
 * @param seq Array of tap types (TAPTYPE_DIT or TAPTYPE_DAH)
 * @returns The character that the sequence encodes
 */
export function getCharacterBySequence(seq: TapType[]): string {
  return traverseTreeRecursive(ROOT, seq, 0);
}

function traverseTreeRecursive(node: MorseNode, seq: TapType[], index: number): string {
  if (seq.length === index) {
    return node.text;
  }

  const nextSequence = seq[index];
  if (nextSequence === TAPTYPE_DAH) {
    // Go left
    if (node.left != null) {
      return traverseTreeRecursive(node.left, seq, ++index);
    }
    return node.text;
  } else {
    // Go right
    if (node.right != null) {
      return traverseTreeRecursive(node.right, seq, ++index);
    }
    return node.text;
  }
}

// Morse code character tree nodes
// Linked as shown in: http://www.learnmorsecode.com/pix/learn.gif
// Listed depth first in reverse order

const FIVE: MorseNode = { text: '5', left: null, right: null };
const FOUR: MorseNode = { text: '4', left: null, right: null };
const H: MorseNode = { text: 'H', left: FOUR, right: FIVE };
const THREE: MorseNode = { text: '3', left: null, right: null };
const V: MorseNode = { text: 'V', left: THREE, right: null };
const S: MorseNode = { text: 'S', left: V, right: H };
const F: MorseNode = { text: 'F', left: null, right: null };
const TWO: MorseNode = { text: '2', left: null, right: null };
const DASH: MorseNode = { text: '-', left: TWO, right: null };
const U: MorseNode = { text: 'U', left: DASH, right: F };
const I: MorseNode = { text: 'I', left: U, right: S };
const L: MorseNode = { text: 'L', left: null, right: null };
const R: MorseNode = { text: 'R', left: null, right: L };
const P: MorseNode = { text: 'P', left: null, right: null };
const ONE: MorseNode = { text: '1', left: null, right: null };
const J: MorseNode = { text: 'J', left: ONE, right: null };
const W: MorseNode = { text: 'W', left: J, right: P };
const A: MorseNode = { text: 'A', left: W, right: R };
const E: MorseNode = { text: 'E', left: A, right: I };
const SIX: MorseNode = { text: '6', left: null, right: null };
const B: MorseNode = { text: 'B', left: null, right: SIX };
const X: MorseNode = { text: 'X', left: null, right: null };
const D: MorseNode = { text: 'D', left: X, right: B };
const Y: MorseNode = { text: 'Y', left: null, right: null };
const C: MorseNode = { text: 'C', left: null, right: null };
const K: MorseNode = { text: 'K', left: Y, right: C };
const N: MorseNode = { text: 'N', left: K, right: D };
const SEVEN: MorseNode = { text: '7', left: null, right: null };
const Z: MorseNode = { text: 'Z', left: null, right: SEVEN };
const Q: MorseNode = { text: 'Q', left: null, right: null };
const G: MorseNode = { text: 'G', left: Q, right: Z };
const EIGHT: MorseNode = { text: '8', left: null, right: null };
const PERIOD: MorseNode = { text: '.', left: null, right: EIGHT };
const NINE: MorseNode = { text: '9', left: null, right: null };
const ZERO: MorseNode = { text: '0', left: null, right: null };
const COMMA: MorseNode = { text: ',', left: ZERO, right: NINE };
const O: MorseNode = { text: 'O', left: COMMA, right: PERIOD };
const M: MorseNode = { text: 'M', left: O, right: G };
const T: MorseNode = { text: 'T', left: M, right: N };
const ROOT: MorseNode = { text: '', left: T, right: E };

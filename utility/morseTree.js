import { TAPTYPE_DIT, TAPTYPE_DAH } from './constants';

// Helper function to traverse the tree.
export function getCharacterBySequence(seq) {
	return traverseTreeRecursive(ROOT, seq, 0); // Start from root.
}
function traverseTreeRecursive(node, seq, index) {
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
	}
	else {
		// Go right
		if (node.right != null) {
			return traverseTreeRecursive(node.right, seq, ++index);
		}
		return node.text;
	}
}

// Linked as shown in image: http://www.learnmorsecode.com/pix/learn.gif
// Morse code character tree nodes, listed depth first in reverse order.
const FIVE = {text: '5', left: null, right: null};
const FOUR = {text: '4', left: null, right: null};
const H = {text: 'H', left: FOUR, right: FIVE};
const THREE = {text: '3', left: null, right: null};
const V = {text: 'V', left: THREE, right: null};
const S = {text: 'S', left: V, right: H};
const F = {text: 'F', left: null, right: null};
const TWO = {text: '2', left: null, right: null};
const DASH = {text: '-', left: TWO, right: null};
const U = {text: 'U', left: DASH, right: F};
const I = {text: 'I', left: U, right: S};
const L = {text: 'L', left: null, right: null};
const R = {text: 'R', left: null, right: L};
const P = {text: 'P', left: null, right: null};
const ONE = {text: '1', left: null, right: null};
const J = {text: 'J', left: ONE, right: null};
const W = {text: 'W', left: J, right: P};
const A = {text: 'A', left: W, right: R};
const E = {text: 'E', left: A, right: I};
const SIX = {text: '6', left: null, right: null};
const B = {text: 'B', left: null, right: SIX};
const X = {text: 'X', left: null, right: null};
const D = {text: 'D', left: X, right: B};
const Y = {text: 'Y', left: null, right: null};
const C = {text: 'C', left: null, right: null};
const K = {text: 'K', left: Y, right: C};
const N = {text: 'N', left: K, right: D};
const SEVEN = {text: '7', left: null, right: null};
const Z = {text: 'Z', left: null, right: SEVEN};
const Q = {text: 'Q', left: null, right: null};
const G = {text: 'G', left: Q, right: Z};
const EIGHT = {text: '8', left: null, right: null};
const PERIOD = {text: '.', left: null, right: EIGHT};
const NINE = {text: '9', left: null, right: null};
const ZERO = {text: '0', left: null, right: null};
const COMMA = {text: ',', left: ZERO, right: NINE};
const O = {text: 'O', left: COMMA, right: PERIOD};
const M = {text: 'M', left: O, right: G};
const T = {text: 'T', left: M, right: N};
const ROOT = {text: '', left: T, right: E};

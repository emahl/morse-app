import { getCharacterBySequence } from '../utility/morseTree';
import { TAPTYPE_DAH, TAPTYPE_DIT } from '../utility/constants';

describe('get correct characters', () => {
	it('get T with dah', () => {
		const character = getCharacterBySequence([TAPTYPE_DAH]);
		expect(character).toEqual('T');
	});
	it('get E with dit', () => {
		const character = getCharacterBySequence([TAPTYPE_DIT]);
		expect(character).toEqual('E');
	});
	it('get R with dit-dah-dit', () => {
		const character = getCharacterBySequence([TAPTYPE_DIT, TAPTYPE_DAH, TAPTYPE_DIT]);
		expect(character).toEqual('R');
	});
	it('get B with dah-dit-dit-dit', () => {
		const character = getCharacterBySequence([TAPTYPE_DAH, TAPTYPE_DIT, TAPTYPE_DIT, TAPTYPE_DIT]);
		expect(character).toEqual('B');
	});
	//...
});

describe('get last valid character with too long sequence tests', () => {
	it('get Y with dah-dit-dah-dah-dah-dah-dah', () => {
		// One dah too many.
		const seq = [TAPTYPE_DAH, TAPTYPE_DIT, TAPTYPE_DAH, TAPTYPE_DAH, TAPTYPE_DAH, TAPTYPE_DAH, TAPTYPE_DAH];
		const character = getCharacterBySequence(seq);
		expect(character).toEqual('Y');
	});
	it('get 5 with dit-dit-dit-dit-dit-dit-dit-dit', () => {
		// Three dit too many.
		const seq = [TAPTYPE_DIT, TAPTYPE_DIT, TAPTYPE_DIT, TAPTYPE_DIT, TAPTYPE_DIT, TAPTYPE_DIT, TAPTYPE_DIT, TAPTYPE_DIT];
		const character = getCharacterBySequence(seq);
		expect(character).toEqual('5');
	});
});

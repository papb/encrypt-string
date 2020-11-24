import { CHARS, REVERSE_CHAR_MAP, INVALID_CHAR_REGEXP } from './printable-char-map';

function uint8blockToString(a: number, b: number, c: number, d: number): string {
	const n = (a * (256 ** 3)) + (b * (256 ** 2)) + (c * 256) + d;
	const k = Math.floor(n / (94 ** 4));
	const w = Math.floor(n / (94 ** 3)) % 94;
	const x = Math.floor(n / (94 ** 2)) % 94;
	const y = Math.floor(n / 94) % 94;
	const z = n % 94;

	return (
		CHARS[k]! +
		CHARS[w]! +
		CHARS[x]! +
		CHARS[y]! +
		CHARS[z]!
	);
}

/**
 * Assumes the provided array has length multiple of 4 and each element is a natural number from 0 to 255 (inclusive).
 */
export function paddedBytesToPrintableString(values: number[]): string {
	if (values.length % 4 !== 0) {
		throw new Error(`The length of the array must be multiple of 4, but got length equal to ${values.length}`);
	}

	const resultParts: string[] = [];

	for (let i = 0; i < values.length; i += 4) {
		resultParts.push(uint8blockToString(values[i]!, values[i + 1]!, values[i + 2]!, values[i + 3]!));
	}

	return resultParts.join('');
}

/**
 * Assumes the provided string has length multiple of 5 and each character is one of the 94 non-space printable ASCII characters.
 */
export function printableStringToPaddedBytes(string: string): number[] {
	if (string.length % 5 !== 0) {
		throw new Error(`The length of the string must be multiple of 5, but got length equal to ${string.length}`);
	}

	const result: number[] = [];

	for (let i = 0; i < string.length; i += 5) {
		const n = (
			REVERSE_CHAR_MAP[string[i]!]! * (94 ** 4) +
			REVERSE_CHAR_MAP[string[i + 1]!]! * (94 ** 3) +
			REVERSE_CHAR_MAP[string[i + 2]!]! * (94 ** 2) +
			REVERSE_CHAR_MAP[string[i + 3]!]! * 94 +
			REVERSE_CHAR_MAP[string[i + 4]!]!
		);

		if (Number.isNaN(n)) {
			const invalidChar = INVALID_CHAR_REGEXP.exec(string.slice(i, i + 5))![0]!;
			throw new Error(`The string has an invalid char: ${invalidChar}`);
		}

		result.push(Math.floor(n / (256 ** 3)));
		result.push(Math.floor(n / (256 ** 2)) % 256);
		result.push(Math.floor(n / 256) % 256);
		result.push(n % 256);
	}

	return result;
}

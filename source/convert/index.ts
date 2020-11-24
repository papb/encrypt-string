import { printableStringToPaddedBytes, paddedBytesToPrintableString } from './convert-blocks';
import { adjustNumberArray, uncoverOriginalNumberArray } from './pad';

/**
 * Assumes each element in the provided array is a natural number from 0 to 255 (inclusive).
 */
export function bytesToPrintableString(values: number[]): string {
	adjustNumberArray(values);
	return paddedBytesToPrintableString(values);
}

/**
 * Assumes the provided string has length multiple of 5 and each character is one of the 94 non-space printable ASCII characters.
 */
export function printableStringToBytes(string: string): number[] {
	const paddedBytes = printableStringToPaddedBytes(string);
	uncoverOriginalNumberArray(paddedBytes);
	return paddedBytes;
}

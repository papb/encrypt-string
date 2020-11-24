export const CHARS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // All ASCII printable chars except space

export const INVALID_CHAR_REGEXP = /[^\w!"#$%&'()*+,-./:;<=>?@[\\\]^`{|}~]/;

if (CHARS.length !== 94) throw new Error('The `encrypt-string` package is broken. Please open an issue at "https://github.com/papb/encrypt-string".');

export const REVERSE_CHAR_MAP: Record<string, number> = {};

for (let i = 0; i < 94; i++) {
	REVERSE_CHAR_MAP[CHARS[i]!] = i;
}

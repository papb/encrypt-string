import { encryptUint8Array, decryptUint8Array, encodeString, decodeString, DecryptionError } from 'encrypt-uint8array';
import { bytesToPrintableString, printableStringToBytes } from './convert';

const NONCE_STRING_FOR_PLAINTEXT = '!.M¼I§9-?nqm¹M8xRJ$krIXþE6±R<¥[';
const NONCE_BYTES_FOR_PASSWORD = [66, 46, 52, 49, 26, 175, 187, 169, 176, 21, 248, 28, 96, 11, 212, 167, 211, 134, 203, 156];

function passwordToUint8Array(password: string | Uint8Array): Uint8Array {
	if (typeof password === 'string') {
		return new Uint8Array([...NONCE_BYTES_FOR_PASSWORD, ...encodeString(password)]);
	}
	return password;
}

async function _encryptString(string: string, password: Uint8Array): Promise<string> {
	const input = encodeString(NONCE_STRING_FOR_PLAINTEXT + string);
	const encryptedBytes = await encryptUint8Array(input, password);
	return bytesToPrintableString([...encryptedBytes]);
}

async function _decryptString(encryptedString: string, password: Uint8Array): Promise<string> {
	let output = '';

	try {
		const encryptedInput = printableStringToBytes(encryptedString);
		const decryptedBytes = await decryptUint8Array(new Uint8Array(encryptedInput), password);
		output = decodeString(decryptedBytes);
	} catch {}

	if (!output.startsWith(NONCE_STRING_FOR_PLAINTEXT)) {
		throw new DecryptionError('Unable to decrypt - password is incorrect or data is corrupted.');
	}

	return output.slice(NONCE_STRING_FOR_PLAINTEXT.length);
}

export async function encryptString(string: string, password: string | Uint8Array): Promise<string> {
	return _encryptString(string, passwordToUint8Array(password));
}

export async function decryptString(encryptedString: string, password: string | Uint8Array): Promise<string> {
	return _decryptString(encryptedString, passwordToUint8Array(password));
}

import CryptoJS from 'crypto-js';

const getEncryptionKey = (): string => {
  const key = process.env.ENCRYPTION_SECRET;
  if (!key || key.length < 16) {
    throw new Error('ENCRYPTION_SECRET must be at least 16 characters');
  }
  return key;
};

/**
 * AES-256 encrypt a plaintext string.
 * Returns a base64-encoded ciphertext with embedded IV.
 */
export function encryptField(plaintext: string): string {
  if (!plaintext) return '';
  const key = getEncryptionKey();
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32)), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  // Prepend IV to ciphertext for decryption
  const combined = iv.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
}

/**
 * AES-256 decrypt a base64-encoded ciphertext.
 */
export function decryptField(ciphertext: string): string {
  if (!ciphertext) return '';
  const key = getEncryptionKey();
  const combined = CryptoJS.enc.Base64.parse(ciphertext);
  // Extract IV (first 16 bytes = 4 words)
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
  const encrypted = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);
  
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encrypted } as CryptoJS.lib.CipherParams,
    CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32)),
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Encrypt multiple fields in an object.
 */
export function encryptFields<T extends Record<string, unknown>>(
  data: T,
  fieldNames: (keyof T)[]
): T {
  const result = { ...data };
  for (const field of fieldNames) {
    if (typeof result[field] === 'string') {
      (result[field] as unknown) = encryptField(result[field] as string);
    }
  }
  return result;
}

/**
 * Decrypt multiple fields in an object.
 */
export function decryptFields<T extends Record<string, unknown>>(
  data: T,
  fieldNames: (keyof T)[]
): T {
  const result = { ...data };
  for (const field of fieldNames) {
    if (typeof result[field] === 'string') {
      (result[field] as unknown) = decryptField(result[field] as string);
    }
  }
  return result;
}

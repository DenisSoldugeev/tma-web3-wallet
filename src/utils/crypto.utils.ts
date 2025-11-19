import { mnemonicNew, mnemonicValidate } from '@ton/crypto';

/**
 * Generate a new mnemonic phrase (24 words)
 */
export const generateMnemonic = async (): Promise<string[]> => {
  return await mnemonicNew(24);
};

/**
 * Validate mnemonic phrase
 */
export const validateMnemonic = async (mnemonic: string[]): Promise<boolean> => {
  return await mnemonicValidate(mnemonic);
};

/**
 * Simple encryption for storage (NOT production-ready, use proper encryption in real app)
 * This is a placeholder for demonstration
 */
export const encryptData = (data: string, password: string): string => {
  // In production, use proper encryption like Web Crypto API
  // This is just a base64 encoding for demonstration
  const combined = `${password}:${data}`;
  return btoa(combined);
};

/**
 * Simple decryption (NOT production-ready)
 */
export const decryptData = (encrypted: string, password: string): string => {
  try {
    const decoded = atob(encrypted);
    const [storedPassword, data] = decoded.split(':');
    if (storedPassword !== password) {
      throw new Error('Invalid password');
    }
    return data;
  } catch (error) {
    throw new Error('Decryption failed');
  }
};

/**
 * Generate a simple hash (for password verification)
 */
export const hashPassword = async (password: string): Promise<string> => {
  // In production, use proper hashing like bcrypt or argon2
  // This is just for demonstration
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

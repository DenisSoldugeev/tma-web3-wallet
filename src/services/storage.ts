import type { Wallet } from '@/types/wallet';

const STORAGE_KEYS = {
  WALLET: 'tma_wallet',
  SETTINGS: 'tma_settings',
};

/**
 * Storage Service for managing wallet data in localStorage
 */
export class StorageService {
  /**
   * Save wallet to localStorage
   */
  static saveWallet(wallet: Wallet): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
    } catch (error) {
      console.error('Failed to save wallet:', error);
      throw new Error('Failed to save wallet');
    }
  }

  /**
   * Get wallet from localStorage
   */
  static getWallet(): Wallet | null {
      console.log('Retrieving wallet from storage');
    try {
      const walletData = localStorage.getItem(STORAGE_KEYS.WALLET);
      if (!walletData) return null;
      return JSON.parse(walletData) as Wallet;
    } catch (error) {
      console.error('Failed to get wallet:', error);
      return null;
    }
  }

  /**
   * Check if wallet exists
   */
  static hasWallet(): boolean {
    return !!this.getWallet();
  }

  /**
   * Delete wallet from localStorage
   */
  static deleteWallet(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.WALLET);
    } catch (error) {
      console.error('Failed to delete wallet:', error);
      throw new Error('Failed to delete wallet');
    }
  }

  /**
   * Clear all storage
   */
  static clearAll(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

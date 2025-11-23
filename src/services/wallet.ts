import { mnemonicToPrivateKey } from '@ton/crypto';
import { WalletContractV5R1 } from '@ton/ton';
import { generateMnemonic, validateMnemonic, encryptData } from '@utils/crypto';

import { StorageService } from './storage';

import type { Wallet, CreateWalletParams, ImportWalletParams } from '@/types/wallet';

/**
 * Wallet Service for managing TON wallet operations
 */
export class WalletService {
  /**
   * Create a new wallet
   */
  static async createWallet(params?: CreateWalletParams): Promise<{ wallet: Wallet; mnemonic: string[] }> {
    try {
      // Generate or use provided mnemonic
      const mnemonic = params?.mnemonic
        ? params.mnemonic.split(' ')
        : await generateMnemonic();

      // Validate mnemonic
      const isValid = await validateMnemonic(mnemonic);
      if (!isValid) {
        throw new Error('Invalid mnemonic');
      }

      // Generate keypair from mnemonic
      const keyPair = await mnemonicToPrivateKey(mnemonic);

      // Create wallet contract V5R1 (W5)
      const workchain = 0;
      const walletContract = WalletContractV5R1.create({
        workchain,
        publicKey: keyPair.publicKey,
      });

      const address = walletContract.address.toString({ bounceable: false });

      // Encrypt the mnemonic for storage
      // In production, use proper encryption with user's password
      const encrypted = encryptData(mnemonic.join(' '), 'default_password');

      const wallet: Wallet = {
        address,
        publicKey: keyPair.publicKey.toString('hex'),
        encrypted,
        createdAt: Date.now(),
      };

      // Save to storage
      StorageService.saveWallet(wallet);

      return {
        wallet,
        mnemonic,
      };
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw new Error('Failed to create wallet');
    }
  }

  /**
   * Import wallet from mnemonic
   */
  static async importWallet(params: ImportWalletParams): Promise<Wallet> {
    try {
      const mnemonic = params.mnemonic.trim().split(' ');

      // Validate mnemonic
      const isValid = await validateMnemonic(mnemonic);
      if (!isValid) {
        throw new Error('Invalid mnemonic phrase');
      }

      // Create wallet using the mnemonic
      const { wallet } = await this.createWallet({
        mnemonic: mnemonic.join(' '),
      });

      return wallet;
    } catch (error) {
      console.error('Failed to import wallet:', error);
      throw new Error('Failed to import wallet');
    }
  }

  /**
   * Get current wallet
   */
  static getWallet(): Wallet | null {
    return StorageService.getWallet();
  }

  /**
   * Check if wallet exists
   */
  static hasWallet(): boolean {
    return StorageService.hasWallet();
  }

  /**
   * Delete wallet
   */
  static deleteWallet(): void {
    StorageService.deleteWallet();
  }

  /**
   * Get decrypted mnemonic for wallet
   */
  static async getMnemonic(wallet: Wallet): Promise<string[]> {
    try {
      const { decryptData } = await import('@utils/crypto');
      const mnemonic = decryptData(wallet.encrypted, 'default_password');
      return mnemonic.split(' ');
    } catch (error) {
      console.error('Failed to decrypt mnemonic:', error);
      throw new Error('Failed to decrypt wallet');
    }
  }
}

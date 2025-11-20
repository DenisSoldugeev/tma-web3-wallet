import { TonClient, Address } from '@ton/ton';
import { formatTON } from '@utils/format.utils';

import type { WalletBalance, Transaction } from '@/types/wallet';

/**
 * TON Service for blockchain interactions
 */
export class TonService {
  private static client: TonClient | null = null;

  /**
   * Initialize TON client
   */
  static initialize() {
    if (!this.client) {
      const endpoint = import.meta.env.VITE_TON_API_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC';
      const apiKey = import.meta.env.VITE_TON_API_KEY;

      if (!apiKey) {
        console.warn('TON API key not configured. Set VITE_TON_API_KEY in .env file');
      }

      this.client = new TonClient({
        endpoint,
        apiKey,
      });
    }
    return this.client;
  }

  /**
   * Get wallet balance
   */
  static async getBalance(address: string): Promise<WalletBalance> {
    try {
      const client = this.initialize();
      const addr = Address.parse(address);
      const balance = await client.getBalance(addr);

      return {
        balance: balance.toString(),
        formatted: formatTON(balance),
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return {
        balance: '0',
        formatted: '0.0000',
      };
    }
  }

  /**
   * Get transaction history
   */
  static async getTransactions(address: string, limit = 10): Promise<Transaction[]> {
    try {
      const client = this.initialize();
      const addr = Address.parse(address);
      const transactions = await client.getTransactions(addr, { limit });

      return transactions.map((tx) => {
        const info = tx.inMessage?.info;
        const value = info && 'value' in info ? info.value.coins.toString() : '0';

        return {
          hash: tx.hash().toString('hex'),
          from: info?.src?.toString() || '',
          to: info?.dest?.toString() || address,
          value,
          timestamp: tx.now * 1000,
          status: 'confirmed' as const,
        };
      });
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }

  /**
   * Send transaction (simplified)
   * In production, this would require proper signing with the wallet's private key
   */
  static async sendTransaction(
    from: string,
    to: string,
    amount: bigint,
    memo?: string,
  ): Promise<string> {
    try {
      // This is a placeholder
      // In production, implement proper transaction signing and sending
      console.log('Sending transaction:', { from, to, amount: amount.toString(), memo });

      // Return mock transaction hash
      return 'mock_tx_hash_' + Date.now();
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }
}

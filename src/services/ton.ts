import { TonClient, Address } from '@ton/ton';
import { formatTON } from '@utils/format';

import type { WalletBalance, Transaction, Jetton } from '@/types/wallet';

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

  /**
   * Get Jettons (tokens) for a wallet
   * Uses TON Center API v3
   */
  static async getJettons(address: string): Promise<Jetton[]> {
    try {
      // Convert user-friendly address to raw format (0:hex)
      const addr = Address.parse(address);
      const rawAddress = addr.toRawString();

      // Use TON Center API v3
      const endpoint = 'https://toncenter.com';

      // Note: API v3 works without key for mainnet
      const url = `${endpoint}/api/v3/jetton/wallets?owner_address=${rawAddress}&limit=100`;
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      const response = await fetch(url, { headers });

      // Handle rate limiting
      if (response.status === 429) {
        console.warn('Rate limit exceeded. Using cached/mock data.');
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) {
        console.warn('TON Center API request failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.warn('Error response:', errorText);
        throw new Error('Failed to fetch jettons');
      }

      const data = await response.json();

      // Get jetton master metadata
      const jettonMasters = new Map<string, any>();
      if (data.address_book) {
        Object.entries(data.address_book).forEach(([addr, info]: [string, any]) => {
          if (info.interfaces?.includes('jetton_master')) {
            jettonMasters.set(addr, info);
          }
        });
      }

      // Parse jetton wallets with minimum balance filter
      // Minimum balance: 100,000 nano-tokens (0.0001 with 9 decimals)
      const MIN_BALANCE = 100000;

      const jettons: Jetton[] = (data.jetton_wallets || [])
        .filter((wallet: any) => {
          const balance = parseFloat(wallet.balance);
          // Filter out zero and dust balances
          return balance >= MIN_BALANCE;
        })
        .map((wallet: any) => {
          const jettonAddress = wallet.jetton;
          const jettonInfo = jettonMasters.get(jettonAddress);

          // Extract symbol from domain or use default
          let symbol = '???';
          let name = 'Unknown Token';

          if (jettonInfo?.domain) {
            // e.g., "usdt-minter.ton" -> "USDT"
            symbol = jettonInfo.domain.split('-')[0].toUpperCase();
            name = symbol + ' Token';
          }

          return {
            address: jettonInfo?.user_friendly || jettonAddress,
            name,
            symbol,
            balance: wallet.balance,
            decimals: 9, // Default for TON jettons
            verified: !!jettonInfo?.domain,
          };
        })
        // Sort by balance (highest first)
        .sort((a: Jetton, b: Jetton) => parseFloat(b.balance) - parseFloat(a.balance));

      console.info(`Found ${jettons.length} jettons with meaningful balance`);
      return jettons;
    } catch (error) {
      console.error('Failed to get jettons:', error);
      // Return mock data for demo/development
      return this.getMockJettons();
    }
  }

  /**
   * Mock Jettons for demo/development
   */
  private static getMockJettons(): Jetton[] {
    return [
      {
        address: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y',
        name: 'Tether USD',
        symbol: 'USDT',
        balance: '1000000000', // 1000 USDT (9 decimals)
        decimals: 9,
        verified: true,
      },
      {
        address: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
        name: 'Wrapped TON',
        symbol: 'WTON',
        balance: '500000000000', // 500 WTON (9 decimals)
        decimals: 9,
        verified: true,
      },
    ];
  }
}

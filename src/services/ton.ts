import { TonClient, Address } from '@ton/ton';
import { formatTON } from '@utils/format';

import type { WalletBalance, Transaction, Jetton } from '@/types/wallet';

/**
 * TON Service for blockchain interactions
 */
export class TonService {
  private static client: TonClient | null = null;

  private static normalizeAddress(address: string): string {
    if (!address) return '';
    try {
      return Address.parse(address).toRawString();
    } catch {
      return address;
    }
  }

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
    const normalizedAddress = this.normalizeAddress(address);

    try {
      const url = `https://tonapi.io/v2/accounts/${normalizedAddress}/events?limit=${limit}`;
      const headers: Record<string, string> = { Accept: 'application/json' };
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`TON API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const transactions: Transaction[] = [];

      (data.events || []).forEach((event: any, eventIndex: number) => {
        const timestamp = (event.timestamp ?? event.utime ?? Math.floor(Date.now() / 1000)) * 1000;
        const actions = Array.isArray(event.actions) ? event.actions : [];

        actions.forEach((action: any, actionIndex: number) => {
          const actionType = (action.type || '').toLowerCase();
          const status: Transaction['status'] =
            action.status === 'ok' ? 'confirmed' : (action.status as Transaction['status']) || 'confirmed';

          const tonTransfer = action.ton_transfer ?? action.TonTransfer ?? (actionType === 'tontransfer' ? action : null);
          if (tonTransfer) {
            const from = this.normalizeAddress(
              tonTransfer.sender?.address ?? tonTransfer.sender ?? action.sender?.address ?? action.sender,
            );
            const to = this.normalizeAddress(
              tonTransfer.recipient?.address ?? tonTransfer.recipient ?? action.recipient?.address ?? action.recipient,
            );
            const amount = (tonTransfer.amount ?? tonTransfer.value ?? action.amount ?? '0').toString();

            transactions.push({
              hash: event.event_id ?? action.event_id ?? `${timestamp}-${eventIndex}-${actionIndex}`,
              from,
              to,
              amount,
              decimals: 9,
              assetSymbol: 'TON',
              timestamp,
              status,
              isIncoming: to === normalizedAddress,
              comment: tonTransfer.comment ?? action.comment,
            });
            return;
          }

          const jettonTransfer =
            action.jetton_transfer ?? action.JettonTransfer ?? (actionType === 'jettontransfer' ? action : null);
          if (jettonTransfer) {
            const jettonMeta = jettonTransfer.jetton ?? jettonTransfer.jetton_info ?? {};
            const decimals = Number(jettonMeta.decimals ?? jettonMeta.scale ?? 9);
            const from = this.normalizeAddress(
              jettonTransfer.sender?.address ?? jettonTransfer.sender ?? action.sender?.address ?? action.sender,
            );
            const to = this.normalizeAddress(
              jettonTransfer.recipient?.address ??
                jettonTransfer.recipient ??
                action.recipient?.address ??
                action.recipient,
            );
            const amount = (jettonTransfer.amount ?? action.amount ?? '0').toString();

            transactions.push({
              hash: `${event.event_id ?? action.event_id ?? timestamp}-${eventIndex}-${actionIndex}`,
              from,
              to,
              amount,
              decimals: Number.isFinite(decimals) ? decimals : 9,
              assetSymbol: jettonMeta.symbol || 'JETTON',
              timestamp,
              status,
              isIncoming: to === normalizedAddress,
              comment: jettonTransfer.comment ?? action.comment,
              icon: jettonMeta.image ?? jettonMeta.image_preview,
              jettonAddress: jettonMeta.address ?? jettonTransfer.jetton,
            });
          }
        });
      });

      if (transactions.length > 0) {
        return transactions.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
      }
    } catch (error) {
      console.error('Failed to get transactions from TON API:', error);
    }

    // Fallback to on-chain client if TON API is unavailable
    return this.getFallbackTransactions(address, limit);
  }

  private static async getFallbackTransactions(address: string, limit: number): Promise<Transaction[]> {
    try {
      const normalizedWallet = this.normalizeAddress(address);
      const client = this.initialize();
      const addr = Address.parse(address);
      const transactions = await client.getTransactions(addr, { limit });

      return transactions.map((tx) => {
        const info = tx.inMessage?.info;
        const value = info && 'value' in info ? info.value.coins.toString() : '0';
        const to = this.normalizeAddress(info?.dest?.toString() || address);
        const from = this.normalizeAddress(info?.src?.toString() || '');

        return {
          hash: tx.hash().toString('hex'),
          from,
          to,
          amount: value,
          decimals: 9,
          assetSymbol: 'TON',
          timestamp: tx.now * 1000,
          status: 'confirmed' as const,
          isIncoming: to === normalizedWallet,
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
   * Uses TON API v2
   */
  static async getJettons(address: string): Promise<Jetton[]> {
    try {
      const rawAddress = this.normalizeAddress(address);
      const url = `https://tonapi.io/v2/accounts/${rawAddress}/jettons`;
      const headers: Record<string, string> = { Accept: 'application/json' };
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`TON API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const balances = data.balances || data.jettons || [];

      const jettons: Jetton[] = balances
        .filter((item: any) => Number(item.balance) > 0)
        .map((item: any) => {
          const meta = item.jetton ?? item.jetton_info ?? {};
          const decimals = Number(meta.decimals ?? meta.scale ?? 9);

          return {
            address: meta.address ?? item.wallet_address ?? item.address ?? '',
            name: meta.name || meta.symbol || 'Unknown Token',
            symbol: meta.symbol || 'JETTON',
            balance: item.balance?.toString?.() ?? '0',
            decimals: Number.isFinite(decimals) ? decimals : 9,
            image: meta.image ?? meta.image_preview,
            verified: meta.verification === 'whitelist' || meta.verification === 'verified' || meta.blacklist === false,
          };
        })
        .sort((a: Jetton, b: Jetton) => parseFloat(b.balance) - parseFloat(a.balance));

      if (jettons.length > 0) {
        console.info(`Found ${jettons.length} jettons with meaningful balance`);
        return jettons;
      }
    } catch (error) {
      console.error('Failed to get jettons:', error);
    }

    // Return mock data for demo/development when API returns empty or fails
    return this.getMockJettons();
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

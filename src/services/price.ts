export interface TONPriceData {
  price: number;
  change24h: number;
}

/**
 * Price Service for fetching cryptocurrency prices
 * Uses CoinGecko API (free tier, no API key required)
 */
export class PriceService {
  private static readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private static priceCache: Map<
    string,
    { price: number; change24h: number; timestamp: number }
  > = new Map();
  private static readonly CACHE_DURATION = 60000; // 1 minute

  /**
   * Get TON price in USD with 24h change percentage
   */
  static async getTONPrice(): Promise<TONPriceData> {
    const cached = this.priceCache.get('TON');
    const now = Date.now();

    // Return cached price if available and fresh
    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      return { price: cached.price, change24h: cached.change24h };
    }

    try {
      const response = await fetch(
        `${this.COINGECKO_API}/simple/price?ids=the-open-network&vs_currencies=usd&include_24hr_change=true`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch TON price');
      }

      const data = await response.json();
      const price = data['the-open-network']?.usd || 0;
      const change24h = data['the-open-network']?.usd_24h_change || 0;

      // Cache the price
      this.priceCache.set('TON', { price, change24h, timestamp: now });

      return { price, change24h };
    } catch (error) {
      console.error('Failed to fetch TON price:', error);
      // Return cached price if available, even if stale
      return cached
        ? { price: cached.price, change24h: cached.change24h }
        : { price: 0, change24h: 0 };
    }
  }

  /**
   * Calculate USD value from TON amount
   */
  static async calculateUSDValue(tonAmount: string | number): Promise<number> {
    const { price } = await this.getTONPrice();
    const amount = typeof tonAmount === 'string' ? parseFloat(tonAmount) : tonAmount;
    return amount * price;
  }

  /**
   * Format USD value
   */
  static formatUSD(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}

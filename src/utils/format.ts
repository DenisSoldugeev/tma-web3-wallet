/**
 * Format TON amount from nano to readable format
 */
export const formatTON = (nanoAmount: string | bigint): string => {
  const amount = BigInt(nanoAmount);
  const ton = Number(amount) / 1e9;
  return ton.toFixed(4);
};

/**
 * Format TON amount with symbol
 */
export const formatTONWithSymbol = (nanoAmount: string | bigint): string => {
  return `${formatTON(nanoAmount)} TON`;
};

/**
 * Parse TON amount to nano
 */
export const parseTON = (amount: string): bigint => {
  const ton = parseFloat(amount);
  return BigInt(Math.floor(ton * 1e9));
};

/**
 * Truncate address for display
 */
export const truncateAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format timestamp to readable date
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Validate TON address format
 */
export const isValidTONAddress = (address: string): boolean => {
  return /^[A-Za-z0-9_-]{48}$/.test(address);
};

/**
 * Validate amount input
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount === '0') return false;
  const regex = /^\d+(\.\d{1,9})?$/;
  return regex.test(amount);
};

/**
 * Format timestamp to relative time (e.g., "2h ago", "3d ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp * 1000; // timestamp in seconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'Just now';
  }
};

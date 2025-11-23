export interface Wallet {
  address: string;
  publicKey: string;
  encrypted: string;
  createdAt: number;
}

export interface WalletBalance {
  balance: string;
  formatted: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  decimals: number;
  assetSymbol: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  isIncoming: boolean;
  comment?: string;
  icon?: string;
  jettonAddress?: string;
}

export interface CreateWalletParams {
  mnemonic?: string;
}

export interface ImportWalletParams {
  mnemonic: string;
}

export interface SendTransactionParams {
  to: string;
  amount: string;
  memo?: string;
}

export interface Jetton {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  image?: string;
  verified?: boolean;
}

import { WalletService } from '@services/wallet';
import { redirect } from '@tanstack/react-router';

/**
 * Route guard that requires a wallet to be present
 * Redirects to home page if no wallet exists
 */
export const requireWallet = () => {
  const wallet = WalletService.getWallet();

  if (!wallet) {
    throw redirect({
      to: '/',
    });
  }

  return wallet;
};

/**
 * Route guard that requires NO wallet to be present (for auth pages)
 * Redirects to wallet page if wallet already exists
 */
export const requireNoWallet = () => {
  const wallet = WalletService.getWallet();

  if (wallet) {
    throw redirect({
      to: '/wallet',
    });
  }
};

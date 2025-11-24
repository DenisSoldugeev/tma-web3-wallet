import { WalletPage } from '@pages/wallet';
import { createFileRoute } from '@tanstack/react-router';
import { requireWallet } from '@utils/route-guards';

export const Route = createFileRoute('/wallet/')({
  component: WalletPage,
  loader: requireWallet,
});

import { SwapPage } from '@pages/swap';
import { createFileRoute } from '@tanstack/react-router';
import { requireWallet } from '@utils/route-guards';

export const Route = createFileRoute('/wallet/swap')({
  component: SwapPage,
  loader: requireWallet,
});

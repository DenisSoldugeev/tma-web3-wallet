import { ReceivePage } from '@pages/receive';
import { createFileRoute } from '@tanstack/react-router';
import { requireWallet } from '@utils/route-guards';

export const Route = createFileRoute('/wallet/receive')({
  component: ReceivePage,
  loader: requireWallet,
});

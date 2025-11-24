import { SendPage } from '@pages/send';
import { createFileRoute } from '@tanstack/react-router';
import { requireWallet } from '@utils/route-guards';

export const Route = createFileRoute('/wallet/send')({
  component: SendPage,
  loader: requireWallet,
});

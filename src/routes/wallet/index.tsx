import { WalletPage } from '@pages/wallet';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/wallet/')({
  component: WalletPage,
});

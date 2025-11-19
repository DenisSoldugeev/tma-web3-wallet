import { createFileRoute } from '@tanstack/react-router';
import { WalletPage } from '@pages/wallet';

export const Route = createFileRoute('/wallet')({
  component: WalletPage,
});
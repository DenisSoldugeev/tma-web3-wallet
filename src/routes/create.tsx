import { CreateWalletPage } from '@pages/create';
import { createFileRoute } from '@tanstack/react-router';
import { requireNoWallet } from '@utils/route-guards';

export const Route = createFileRoute('/create')({
  component: CreateWalletPage,
  beforeLoad: requireNoWallet,
});

import { ImportWalletPage } from '@pages/import';
import { createFileRoute } from '@tanstack/react-router';
import { requireNoWallet } from '@utils/route-guards';

export const Route = createFileRoute('/import')({
  component: ImportWalletPage,
  beforeLoad: requireNoWallet,
});

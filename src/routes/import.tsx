import { ImportWalletPage } from '@pages/import';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/import')({
  component: ImportWalletPage,
});

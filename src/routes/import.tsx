import { createFileRoute } from '@tanstack/react-router';
import { ImportWalletPage } from '@pages/import';

export const Route = createFileRoute('/import')({
  component: ImportWalletPage,
});
import { CreateWalletPage } from '@pages/create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create')({
  component: CreateWalletPage,
});

import { createFileRoute } from '@tanstack/react-router';
import { CreateWalletPage } from '@pages/create';

export const Route = createFileRoute('/create')({
  component: CreateWalletPage,
});
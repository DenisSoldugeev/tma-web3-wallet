import { ReceivePage } from '@pages/receive';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/wallet/receive')({
  component: ReceivePage,
});

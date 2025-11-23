import { SendPage } from '@pages/send';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/wallet/send')({
  component: SendPage,
});

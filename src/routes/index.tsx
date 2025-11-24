import { WelcomePage } from '@pages/welcome';
import { createFileRoute } from '@tanstack/react-router';
import { requireNoWallet } from '@utils/route-guards';

export const Route = createFileRoute('/')({
  component: WelcomePage,
  beforeLoad: requireNoWallet,
});

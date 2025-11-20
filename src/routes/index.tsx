import { WelcomePage } from '@pages/welcome';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: WelcomePage,
});

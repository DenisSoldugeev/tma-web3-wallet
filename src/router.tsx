import { createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export const router = createRouter({
  routeTree,
  basepath: '/tma-web3-wallet',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

import { useNavigate } from '@tanstack/react-router';
import { navigateWithTransition, type TransitionDirection } from '@utils/viewTransition';
import { useCallback } from 'react';

export function useTransitionNavigate() {
  const routerNavigate = useNavigate();

  return useCallback(
      async (
          options: Parameters<typeof routerNavigate>[0],
          direction: TransitionDirection = 'forward',
      ) => {
          await navigateWithTransition(() => {
              routerNavigate(options);
          }, direction);
      },
      [routerNavigate],
  );
}

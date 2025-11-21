import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './GlassContainer.module.scss';

interface GlassContainerProps {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'subtle';
  className?: string;
  onClick?: () => void;
}

export const GlassContainer = ({
  children,
  variant = 'default',
  className,
  onClick,
}: GlassContainerProps) => {
  return (
    <div
      className={clsx(
        styles.container,
        styles[variant],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

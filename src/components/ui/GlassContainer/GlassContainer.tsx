import clsx from 'clsx';
import type { KeyboardEvent, MouseEventHandler, ReactNode } from 'react';

import styles from './GlassContainer.module.scss';

interface GlassContainerProps {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const GlassContainer = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
}: GlassContainerProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={clsx(
        styles['container'],
        styles[`container--${variant}`],
        styles[`container--${size}`],
        className,
      )}
      {...(onClick && {
        onClick: onClick as MouseEventHandler<HTMLDivElement>,
        role: 'button',
        tabIndex: 0,
        onKeyDown: handleKeyDown,
      })}
    >
      {children}
    </div>
  );
};

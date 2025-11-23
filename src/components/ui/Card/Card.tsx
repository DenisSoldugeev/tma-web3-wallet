import clsx from 'clsx';
import type { KeyboardEvent, ReactNode } from 'react';

import styles from './Card.module.scss';

interface CardProps {
  children: ReactNode;
  gradient?: boolean;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card = ({
  children,
  gradient = false,
  hoverable = false,
  className,
  onClick,
}: CardProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={clsx(
        styles['card'],
        {
          [styles['card--gradient']]: gradient,
          [styles['card--hoverable']]: hoverable,
        },
        className,
      )}
      {...(onClick && {
        onClick,
        role: 'button',
        tabIndex: 0,
        onKeyDown: handleKeyDown,
      })}
    >
      {children}
    </div>
  );
};

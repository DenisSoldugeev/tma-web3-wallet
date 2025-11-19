import type { ReactNode } from 'react';
import styles from './Card.module.scss';
import classNames from 'classnames';

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
  return (
    <div
      className={classNames(
        styles.card,
        {
          [styles.gradient]: gradient,
          [styles.hoverable]: hoverable,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

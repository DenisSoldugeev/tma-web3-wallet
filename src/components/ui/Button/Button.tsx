import clsx from 'clsx';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disableHaptic?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  onClick,
  ...props
}: ButtonProps) => {

  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        {
          [styles.fullWidth]: fullWidth,
          [styles.loading]: loading,
        },
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className={styles.loader} />
      ) : (
        children
      )}
    </button>
  );
};

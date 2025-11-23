import clsx from 'clsx';
import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, className, ...props }, ref) => {
    return (
      <div className={styles['input']}>
        {label && <label className={styles['input__label']}>{label}</label>}
        <input
          ref={ref}
          className={clsx(
            styles['input__field'],
            {
              [styles['input__field--error']]: error,
              [styles['input__field--success']]: success,
            },
            className,
          )}
          {...props}
        />
        {error && <span className={styles['input__error-text']}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';

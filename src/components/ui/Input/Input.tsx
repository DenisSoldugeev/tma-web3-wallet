import clsx from 'clsx';
import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRight?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelRight, suffix, error, success, className, ...props }, ref) => {
    return (
      <div className={styles['input']}>
        {label && (
          labelRight ? (
            <div className={styles['input__label-row']}>
              <label className={styles['input__label']}>{label}</label>
              <div className={styles['input__label-right']}>{labelRight}</div>
            </div>
          ) : (
            <label className={styles['input__label']}>{label}</label>
          )
        )}
        {suffix ? (
          <div className={styles['input__wrapper']}>
            <input
              ref={ref}
              className={clsx(
                styles['input__field'],
                {
                  [styles['input__field--error']]: error,
                  [styles['input__field--success']]: success,
                  [styles['input__field--with-suffix']]: suffix,
                },
                className,
              )}
              {...props}
            />
            <div className={styles['input__suffix']}>{suffix}</div>
          </div>
        ) : (
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
        )}
        {error && <span className={styles['input__error-text']}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';

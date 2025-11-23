import { BadgeCheck, Coins } from 'lucide-react';
import type { FC } from 'react';

import styles from './JettonList.module.scss';

import type { Jetton } from '@/types/wallet';

interface JettonItemProps {
  jetton: Jetton;
  index: number;
}

export const JettonItem: FC<JettonItemProps> = ({ jetton, index }) => {
  const formatBalance = (balance: string, decimals: number): string => {
    const value = Number(balance) / Math.pow(10, decimals);
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  return (
    <div
      className={styles.jettonItem}
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className={styles.jettonItem__icon}>
        {jetton.image ? (
          <img src={jetton.image} alt={jetton.symbol} className={styles.jettonItem__image} />
        ) : (
          <Coins size={24} />
        )}
      </div>

      <div className={styles.jettonItem__content}>
        <div className={styles.jettonItem__header}>
          <div className={styles.jettonItem__name}>
            <span className={styles.jettonItem__symbol}>{jetton.symbol}</span>
            {jetton.verified && (
              <BadgeCheck size={14} className={styles.jettonItem__verified} />
            )}
          </div>
          <span className={styles.jettonItem__balance}>
            {formatBalance(jetton.balance, jetton.decimals)}
          </span>
        </div>
        <div className={styles.jettonItem__details}>
          <span className={styles.jettonItem__fullName}>{jetton.name}</span>
        </div>
      </div>
    </div>
  );
};

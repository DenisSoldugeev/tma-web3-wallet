import { Wallet } from 'lucide-react';
import type { FC } from 'react';

import { JettonItem } from './JettonItem';
import styles from './JettonList.module.scss';

import type { Jetton } from '@/types/wallet';

interface JettonListProps {
  jettons: Jetton[];
  isLoading?: boolean;
}

export const JettonList: FC<JettonListProps> = ({ jettons, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.jettonList}>
        <h3 className={styles.jettonList__title}>Tokens</h3>
        <div className={styles.jettonList__skeletons}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  if (!jettons || jettons.length === 0) {
    return (
      <div className={styles.jettonList}>
        <h3 className={styles.jettonList__title}>Tokens</h3>
        <div className={styles.emptyState}>
          <div className={styles.emptyState__icon}>
            <Wallet size={40} strokeWidth={1.5} />
          </div>
          <p className={styles.emptyState__title}>No tokens</p>
          <p className={styles.emptyState__description}>You don't have any tokens yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.jettonList}>
      <h3 className={styles.jettonList__title}>
        Tokens <span className={styles.jettonList__count}>({jettons.length})</span>
      </h3>
      <div className={styles.jettonList__items}>
        {jettons.map((jetton, index) => (
          <JettonItem key={jetton.address} jetton={jetton} index={index} />
        ))}
      </div>
    </div>
  );
};

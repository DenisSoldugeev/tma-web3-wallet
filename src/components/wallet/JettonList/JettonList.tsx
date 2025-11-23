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
      <div className={styles['jetton-list']}>
        <h3 className={styles['jetton-list__title']}>Tokens</h3>
        <div className={styles['jetton-list__skeletons']}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles['skeleton']} />
          ))}
        </div>
      </div>
    );
  }

  if (!jettons || jettons.length === 0) {
    return (
      <div className={styles['jetton-list']}>
        <h3 className={styles['jetton-list__title']}>Tokens</h3>
        <div className={styles['empty-state']}>
          <div className={styles['empty-state__icon']}>
            <Wallet size={40} strokeWidth={1.5} />
          </div>
          <p className={styles['empty-state__title']}>No tokens</p>
          <p className={styles['empty-state__description']}>You don't have any tokens yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['jetton-list']}>
      <h3 className={styles['jetton-list__title']}>
        Tokens <span className={styles['jetton-list__count']}>({jettons.length})</span>
      </h3>
      <div className={styles['jetton-list__items']}>
        {jettons.map((jetton, index) => (
          <JettonItem key={jetton.address} jetton={jetton} index={index} />
        ))}
      </div>
    </div>
  );
};

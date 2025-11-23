import { Inbox } from 'lucide-react';
import type { FC } from 'react';

import { TransactionItem } from './TransactionItem';
import styles from './TransactionList.module.scss';

import type { Transaction } from '@/types/wallet';

interface TransactionListProps {
  transactions: Transaction[];
  currentAddress: string;
  isLoading?: boolean;
  title?: string;
}

export const TransactionList: FC<TransactionListProps> = ({
  transactions,
  currentAddress,
  isLoading,
  title = 'Recent Transactions',
}) => {
  if (isLoading) {
    return (
      <div className={styles['transaction-list']}>
        <h3 className={styles['transaction-list__title']}>{title}</h3>
        <div className={styles['transaction-list__skeletons']}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles['skeleton']} />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles['transaction-list']}>
        <h3 className={styles['transaction-list__title']}>{title}</h3>
        <div className={styles['empty-state']}>
          <div className={styles['empty-state__icon']}>
            <Inbox size={48} strokeWidth={1.5} />
          </div>
          <p className={styles['empty-state__title']}>No transactions yet</p>
          <p className={styles['empty-state__description']}>
            Your transaction history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['transaction-list']}>
      <h3 className={styles['transaction-list__title']}>{title}</h3>
      <div className={styles['transaction-list__items']}>
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.hash}
            transaction={transaction}
            currentAddress={currentAddress}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

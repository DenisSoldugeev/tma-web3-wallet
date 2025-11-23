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
      <div className={styles.transactionList}>
        <h3 className={styles.transactionList__title}>{title}</h3>
        <div className={styles.transactionList__skeletons}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles.transactionList}>
        <h3 className={styles.transactionList__title}>{title}</h3>
        <div className={styles.emptyState}>
          <div className={styles.emptyState__icon}>
            <Inbox size={48} strokeWidth={1.5} />
          </div>
          <p className={styles.emptyState__title}>No transactions yet</p>
          <p className={styles.emptyState__description}>
            Your transaction history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.transactionList}>
      <h3 className={styles.transactionList__title}>{title}</h3>
      <div className={styles.transactionList__items}>
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

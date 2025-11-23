import { formatRelativeTime, formatTON, truncateAddress } from '@utils/format';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { FC } from 'react';

import styles from './TransactionList.module.scss';

import type { Transaction } from '@/types/wallet';

interface TransactionItemProps {
  transaction: Transaction;
  currentAddress: string;
  index: number;
}

export const TransactionItem: FC<TransactionItemProps> = ({ transaction, currentAddress, index }) => {
  const isReceived = transaction.to.toLowerCase() === currentAddress.toLowerCase();
  const isConfirmed = transaction.status === 'confirmed';
  const otherAddress = isReceived ? transaction.from : transaction.to;

  return (
    <div
      className={styles.transactionItem}
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className={`${styles.transactionItem__icon} ${isReceived ? styles['transactionItem__icon--received'] : styles['transactionItem__icon--sent']}`}>
        {isReceived ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
      </div>

      <div className={styles.transactionItem__content}>
        <div className={styles.transactionItem__header}>
          <span className={styles.transactionItem__type}>{isReceived ? 'Received' : 'Sent'}</span>
          <span className={`${styles.transactionItem__amount} ${isReceived ? styles['transactionItem__amount--positive'] : styles['transactionItem__amount--negative']}`}>
            {isReceived ? '+' : '-'}{formatTON(transaction.value)} TON
          </span>
        </div>

        <div className={styles.transactionItem__details}>
          <span className={styles.transactionItem__address}>
            {isReceived ? 'from' : 'to'} {truncateAddress(otherAddress, 6, 4)}
          </span>
          <span className={styles.transactionItem__time}>{formatRelativeTime(transaction.timestamp / 1000)}</span>
        </div>

        {!isConfirmed && (
          <div className={styles.transactionItem__status}>
            <span className={`${styles.statusBadge} ${styles[`statusBadge--${transaction.status}`]}`}>
              {transaction.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

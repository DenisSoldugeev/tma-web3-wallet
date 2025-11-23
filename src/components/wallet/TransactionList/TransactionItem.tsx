import { formatRelativeTime, truncateAddress } from '@utils/format';
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
  const normalizedCurrent = currentAddress.toLowerCase();
  const isReceived = transaction.isIncoming ?? transaction.to.toLowerCase() === normalizedCurrent;
  const isConfirmed = transaction.status === 'confirmed';
  const otherAddress = isReceived ? transaction.from : transaction.to;
  const decimals = transaction.decimals ?? 9;
  const symbol = transaction.assetSymbol || 'TON';

  const formatAmount = (amount: string, tokenDecimals: number): string => {
    const value = Number(amount) / Math.pow(10, tokenDecimals || 0);
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: Math.min(6, tokenDecimals || 2),
    });
  };

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
          <span className={styles.transactionItem__type}>
            {isReceived ? 'Received' : 'Sent'} {symbol}
          </span>
          <span className={`${styles.transactionItem__amount} ${isReceived ? styles['transactionItem__amount--positive'] : styles['transactionItem__amount--negative']}`}>
            {isReceived ? '+' : '-'}{formatAmount(transaction.amount, decimals)} {symbol}
          </span>
        </div>

        <div className={styles.transactionItem__details}>
          <span className={styles.transactionItem__address}>
            {isReceived ? 'from' : 'to'} {truncateAddress(otherAddress || '', 6, 4)}
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

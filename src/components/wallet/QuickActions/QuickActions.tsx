import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { FC } from 'react';

import styles from './QuickActions.module.scss';

interface QuickActionsProps {
  onSend?: () => void;
  onReceive?: () => void;
}

export const QuickActions: FC<QuickActionsProps> = ({ onSend, onReceive }) => {
  const actions = [
    {
      id: 'send',
      label: 'Send',
      icon: ArrowUpRight,
      onClick: onSend,
      variant: 'primary' as const,
    },
    {
      id: 'receive',
      label: 'Receive',
      icon: ArrowDownLeft,
      onClick: onReceive,
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className={styles.quickActions}>
      {actions.map((action, index) => (
        <button
          key={action.id}
          type='button'
          className={`${styles.actionButton} ${styles[`actionButton--${action.variant}`]}`}
          onClick={action.onClick}
          style={{
            animationDelay: `${index * 0.05}s`,
          }}
        >
          <div className={styles.actionButton__icon}>
            <action.icon size={24} strokeWidth={2} />
          </div>
          <span className={styles.actionButton__label}>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

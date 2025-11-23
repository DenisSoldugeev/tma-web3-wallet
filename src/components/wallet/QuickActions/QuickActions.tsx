import { ArrowDownCircle, ArrowUpCircle, RefreshCw, Settings } from 'lucide-react';
import type { FC } from 'react';

import styles from './QuickActions.module.scss';

interface QuickActionsProps {
  onSend?: () => void;
  onReceive?: () => void;
  onSwap?: () => void;
  onSettings?: () => void;
}

export const QuickActions: FC<QuickActionsProps> = ({
  onSend,
  onReceive,
  onSwap,
  onSettings,
}) => {
  const actions = [
    {
      id: 'send',
      label: 'Send',
      icon: ArrowUpCircle,
      onClick: onSend,
      variant: 'primary' as const,
    },
    {
      id: 'receive',
      label: 'Receive',
      icon: ArrowDownCircle,
      onClick: onReceive,
      variant: 'secondary' as const,
    },
    {
      id: 'swap',
      label: 'Swap',
      icon: RefreshCw,
      onClick: onSwap,
      variant: 'accent' as const,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: onSettings,
      variant: 'neutral' as const,
    },
  ];

  return (
    <div className={styles.quickActions}>
      {actions.map((action, index) => (
        <button
          key={action.id}
          type="button"
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

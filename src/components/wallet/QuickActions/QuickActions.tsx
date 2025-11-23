import { GlassContainer } from '@components/ui/GlassContainer';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { FC } from 'react';

import styles from './QuickActions.module.scss';

interface QuickActionsProps {
  onSend?: () => void;
  onReceive?: () => void;
}

export const QuickActions: FC<QuickActionsProps> = ({ onSend, onReceive }) => {
  return (
    <div className={styles.quickActions}>
      <GlassContainer
        variant="subtle"
        size="sm"
        onClick={onSend}
        className={styles.actionCard}
      >
        <div className={styles.actionIcon}>
          <ArrowUpRight size={24} strokeWidth={2.5} />
        </div>
        <span className={styles.actionLabel}>Send</span>
      </GlassContainer>

      <GlassContainer
        variant="subtle"
        size="sm"
        onClick={onReceive}
        className={styles.actionCard}
      >
        <div className={styles.actionIcon}>
          <ArrowDownLeft size={24} strokeWidth={2.5} />
        </div>
        <span className={styles.actionLabel}>Receive</span>
      </GlassContainer>
    </div>
  );
};

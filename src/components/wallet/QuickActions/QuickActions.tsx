import { GlassContainer } from '@components/ui/GlassContainer';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import type { FC } from 'react';

import styles from './QuickActions.module.scss';

interface QuickActionsProps {
    onSend?: () => void;
    onReceive?: () => void;
    onSwap?: () => void;
}

export const QuickActions: FC<QuickActionsProps> = ({ onSend, onReceive, onSwap }) => {
    return (
        <div className={styles['quick-actions']}>
            <GlassContainer
                variant="subtle"
                size="sm"
                onClick={onSend}
                className={styles['quick-actions__action-card']}
            >
                <div className={styles['quick-actions__action-icon']}>
                    <ArrowUpRight size={24} strokeWidth={2.5}/>
                </div>
                <span className={styles['quick-actions__action-label']}>Send</span>
            </GlassContainer>

            <GlassContainer
                variant="subtle"
                size="sm"
                onClick={onSwap}
                className={styles['quick-actions__action-card']}
            >
                <div className={styles['quick-actions__action-icon']}>
                    <ArrowLeftRight size={24} strokeWidth={2.5}/>
                </div>
                <span className={styles['quick-actions__action-label']}>Swap</span>
            </GlassContainer>

            <GlassContainer
                variant="subtle"
                size="sm"
                onClick={onReceive}
                className={styles['quick-actions__action-card']}
            >
                <div className={styles['quick-actions__action-icon']}>
                    <ArrowDownLeft size={24} strokeWidth={2.5}/>
                </div>
                <span className={styles['quick-actions__action-label']}>Receive</span>
            </GlassContainer>

        </div>
    );
};

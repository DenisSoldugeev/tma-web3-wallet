import { ActionCard } from '@components/wallet/ActionCard';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { MainButton } from '@twa-dev/sdk/react';
import clsx from 'clsx';
import { KeyRound, Wallet } from 'lucide-react';
import { useState } from 'react';

import styles from './WelcomePage.module.scss';

type WalletAction = 'create' | 'import' | null;

export function WelcomePage() {
    const navigate = useTransitionNavigate();
    const [selectedAction, setSelectedAction] = useState<WalletAction>('create');

    return (
        <div className={clsx('.page-container', styles['welcome-page'])}>
            <div className={styles['welcome-page__content']}>
                <div className={styles['welcome-page__header']}>
                    <h1 className={styles['welcome-page__title']}>TMA Wallet</h1>
                    <p className={styles['welcome-page__subtitle']}>
                        Secure TON wallet for Telegram Mini Apps
                    </p>
                </div>

                <div className={styles['welcome-page__actions']}>
                    <ActionCard
                        icon={<KeyRound size={28} strokeWidth={2} />}
                        title="Create New Wallet"
                        description="Generate a new secure wallet with recovery phrase"
                        gradient="primary"
                        onClick={() => setSelectedAction('create')}
                        selected={selectedAction === 'create'}
                    />

                    <ActionCard
                        icon={<Wallet size={28} strokeWidth={2} />}
                        title="Import Wallet"
                        description="Restore your wallet using recovery phrase"
                        gradient="secondary"
                        onClick={() => setSelectedAction('import')}
                        selected={selectedAction === 'import'}
                    />
                </div>
            </div>
            <div className={styles['welcome-page__footer']}>
                <p className={styles['welcome-page__footer-text']}>
                    Educational project for Telegram Mini Apps integration
                </p>
                <p className={styles['welcome-page__footer-subtitle']}>
                    Learn how to build secure wallet apps with TON blockchain
                </p>
            </div>
            {selectedAction && <MainButton
                hasShineEffect={true}
                text={selectedAction === 'create' ? 'Create Wallet' : 'Import Wallet'}
                disabled={!selectedAction}
                onClick={() => {
                    if (selectedAction === 'create') {
                        navigate({ to: '/create' }, 'forward');
                    } else if (selectedAction === 'import') {
                        navigate({ to: '/import' }, 'forward');
                    }
                }}
            />}
        </div>
    );
}

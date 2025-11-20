import { ActionCard } from '@components/wallet/ActionCard';
import { WalletService } from '@services/wallet';
import { useNavigate } from '@tanstack/react-router';
import { MainButton } from '@twa-dev/sdk/react';
import { KeyRound, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

import styles from './WelcomePage.module.scss';

type WalletAction = 'create' | 'import' | null;

export function WelcomePage() {
    const navigate = useNavigate();
    const [selectedAction, setSelectedAction] = useState<WalletAction>(null);

    useEffect(() => {
        if (WalletService.hasWallet()) {
            navigate({ to: '/wallet' }).then();
        }
    }, [navigate]);

    return (
        <div className={styles['welcome-page']}>
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
                <p className={styles['welcome-page__footer']}>
                    Your keys, your crypto. Always secure.
                </p>
            </div>
            {selectedAction && <MainButton
                text={selectedAction === 'create' ? 'Create Wallet' : 'Import Wallet'}
                disabled={!selectedAction}
                onClick={() => {
                    if (selectedAction === 'create') {
                        navigate({ to: '/create' }).then();
                    } else if (selectedAction === 'import') {
                        navigate({ to: '/import' }).then();
                    }
                }}
            />}
        </div>
    );
}

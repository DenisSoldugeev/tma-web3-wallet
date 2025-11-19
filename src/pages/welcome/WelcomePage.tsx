import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ActionCard } from '@components/wallet/ActionCard';
import { WalletService } from '@services/wallet.service';
import styles from './WelcomePage.module.scss';
import {MainButton} from "@twa-dev/sdk/react";

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
    <div className={styles.welcome}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>TMA Wallet</h1>
          <p className={styles.subtitle}>
            Secure TON wallet for Telegram Mini Apps
          </p>
        </div>

        <div className={styles.actions}>
          <ActionCard
            icon="🔑"
            title="Create New Wallet"
            description="Generate a new secure wallet with recovery phrase"
            gradient="primary"
            onClick={() => setSelectedAction('create')}
            selected={selectedAction === 'create'}
          />

          <ActionCard
            icon="📥"
            title="Import Wallet"
            description="Restore your wallet using recovery phrase"
            gradient="secondary"
            onClick={() => setSelectedAction('import')}
            selected={selectedAction === 'import'}
          />
        </div>

        <p className={styles.footer}>
          Your keys, your crypto. Always secure.
        </p>
      </div>
        <MainButton text={selectedAction === 'create' ? 'Create Wallet' : 'Import Wallet'}  />
    </div>
  );
}
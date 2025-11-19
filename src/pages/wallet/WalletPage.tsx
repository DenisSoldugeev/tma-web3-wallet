import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { WalletService } from '@services/wallet.service';
import { TonService } from '@services/ton.service';
import { truncateAddress } from '@utils/format.utils';
import styles from './WalletPage.module.scss';

export function WalletPage() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(WalletService.getWallet());
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    if (!wallet) {
      navigate({ to: '/' });
    }
  }, [wallet, navigate]);

  // Fetch balance
  const { data: balance, isLoading } = useQuery({
    queryKey: ['balance', wallet?.address],
    queryFn: () => TonService.getBalance(wallet!.address),
    enabled: !!wallet,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const handleCopyAddress = async () => {
    if (wallet) {
      await navigator.clipboard.writeText(wallet.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleLogout = () => {
    WalletService.deleteWallet();
    setWallet(null);
    navigate({ to: '/' });
  };

  if (!wallet) return null;

  return (
    <div className={styles.wallet}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Wallet</h1>
        </div>
        <div>
          <Card gradient className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
              <span className={styles.balanceLabel}>Total Balance</span>
            </div>
            <div className={styles.balanceAmount}>
              {isLoading ? (
                <div className={styles.skeleton} />
              ) : (
                <h2>{balance?.formatted || '0.0000'} TON</h2>
              )}
            </div>
            <div className={styles.addressContainer}>
              <span className={styles.address}>{truncateAddress(wallet.address)}</span>
              <button className={styles.copyButton} onClick={handleCopyAddress}>
                {copiedAddress ? '✓' : '📋'}
              </button>
            </div>
          </Card>
        </div>

        <div className={styles.actions}>
          <Card hoverable className={styles.actionCard}>
            <div className={styles.actionIcon}>📤</div>
            <div className={styles.actionContent}>
              <h3>Send</h3>
              <p>Send TON to address</p>
            </div>
          </Card>

          <Card hoverable className={styles.actionCard}>
            <div className={styles.actionIcon}>📥</div>
            <div className={styles.actionContent}>
              <h3>Receive</h3>
              <p>Show your address</p>
            </div>
          </Card>
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
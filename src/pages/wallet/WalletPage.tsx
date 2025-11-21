import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { TonService } from '@services/ton.ts';
import { WalletService } from '@services/wallet.ts';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress } from '@utils/format';
import { useEffect, useState } from 'react';

import styles from './WalletPage.module.scss';

export function WalletPage() {
    const navigate = useTransitionNavigate();
    const [wallet, setWallet] = useState(WalletService.getWallet());
    const [copiedAddress, setCopiedAddress] = useState(false);

    useEffect(() => {
        if (!wallet) {
            navigate({ to: '/' }, 'backward');
        }
    }, [wallet, navigate]);

    // Fetch balance
    const { data: balance, isLoading } = useQuery({
        queryKey: ['balance', wallet?.address],
        queryFn: () => TonService.getBalance(wallet!.address),
        enabled: !!wallet,
        refetchInterval: 10000,
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
        navigate({ to: '/' }, 'backward');
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
                                <div className={styles.skeleton}/>
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

                <div className={styles.footer}>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}

import { Card } from '@components/ui/Card';
import { JettonList } from '@components/wallet/JettonList';
import { QuickActions } from '@components/wallet/QuickActions';
import { TransactionList } from '@components/wallet/TransactionList';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { PriceService } from '@services/price';
import { TonService } from '@services/ton.ts';
import { WalletService } from '@services/wallet.ts';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress } from '@utils/format';
import { Copy, Check, LogOut, QrCode, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    const { data: balance, isLoading: isBalanceLoading } = useQuery({
        queryKey: ['balance', wallet?.address],
        queryFn: () => wallet && TonService.getBalance(wallet.address),
        enabled: !!wallet,
        refetchInterval: 10000,
    });

    // Fetch transactions
    const { data: transactions = [], isLoading: isTransactionsLoading } = useQuery({
        queryKey: ['transactions', wallet?.address],
        queryFn: async () => {
            if (!wallet) return [];
            return await TonService.getTransactions(wallet.address, 10);
        },
        enabled: !!wallet,
        refetchInterval: 30000,
    });

    // Fetch TON price in USD
    const { data: tonPrice } = useQuery({
        queryKey: ['ton-price'],
        queryFn: () => PriceService.getTONPrice(),
        refetchInterval: 60000, // Update every minute
    });

    // Fetch Jettons
    const { data: jettons = [], isLoading: isJettonsLoading } = useQuery({
        queryKey: ['jettons', wallet?.address],
        queryFn: async () => {
            if (!wallet) return [];
            return await TonService.getJettons(wallet.address);
        },
        enabled: !!wallet,
        refetchInterval: 60000,
    });

    // Calculate USD value
    const usdValue = balance && tonPrice
        ? parseFloat(balance.formatted) * tonPrice
        : 0;

    const handleCopyAddress = async () => {
        if (wallet) {
            await navigator.clipboard.writeText(wallet.address);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
        }
    };

    const handleSend = () => {
        // TODO: Implement send modal
        console.log('Send clicked');
    };

    const handleReceive = () => {
        // TODO: Implement receive modal with QR code
        console.log('Receive clicked');
    };

    const handleSwap = () => {
        // TODO: Implement swap functionality
        console.log('Swap clicked');
    };

    const handleSettings = () => {
        // TODO: Implement settings page
        console.log('Settings clicked');
    };

    const handleLogout = () => {
        WalletService.deleteWallet();
        setWallet(null);
        navigate({ to: '/' }, 'backward').then();
    };

    if (!wallet) return null;

    return (
        <div className={styles.wallet}>
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>My Wallet</h1>
                    <button className={styles.logoutButton} onClick={handleLogout} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Balance Card */}
                <Card gradient className={styles.balanceCard}>
                    <div className={styles.balanceHeader}>
                        <span className={styles.balanceLabel}>Total Balance</span>
                    </div>
                    <div className={styles.balanceAmount}>
                        {isBalanceLoading ? (
                            <div className={styles.skeleton}/>
                        ) : (
                            <>
                                <h2 className={styles.balance}>{balance?.formatted || '0.0000'} TON</h2>
                                {tonPrice && (
                                    <div className={styles.usdValue}>
                                        <span className={styles.usdAmount}>
                                            ≈ {PriceService.formatUSD(usdValue)}
                                        </span>
                                        <div className={styles.priceChange}>
                                            <TrendingUp size={12} />
                                            <span>TON @ ${tonPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className={styles.addressContainer}>
                        <span className={styles.address}>{truncateAddress(wallet.address, 8, 6)}</span>
                        <div className={styles.addressActions}>
                            <button
                                className={styles.iconButton}
                                onClick={handleCopyAddress}
                                title="Copy address"
                            >
                                {copiedAddress ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                            <button
                                className={styles.iconButton}
                                onClick={handleReceive}
                                title="Show QR code"
                            >
                                <QrCode size={16} />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions */}
                <QuickActions
                    onSend={handleSend}
                    onReceive={handleReceive}
                    onSwap={handleSwap}
                    onSettings={handleSettings}
                />

                {/* Jettons List */}
                <JettonList jettons={jettons} isLoading={isJettonsLoading} />

                {/* Transaction List */}
                <TransactionList
                    transactions={transactions}
                    currentAddress={wallet.address}
                    isLoading={isTransactionsLoading}
                />
            </div>
        </div>
    );
}

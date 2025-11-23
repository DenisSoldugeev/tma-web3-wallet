import { GlassContainer } from '@components/ui/GlassContainer';
import { Icon } from '@components/ui/Icon';
import { QuickActions } from '@components/wallet/QuickActions';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { PriceService } from '@services/price';
import { TonService } from '@services/ton.ts';
import { WalletService } from '@services/wallet.ts';
import { useQuery } from '@tanstack/react-query';
import { truncateAddress } from '@utils/format';
import { getTelegramWebApp, triggerHapticImpact } from '@utils/telegram';
import { LogOut, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import styles from './WalletPage.module.scss';

export function WalletPage() {
    const navigate = useTransitionNavigate();
    const [wallet, setWallet] = useState(WalletService.getWallet());

    useEffect(() => {
        if (!wallet) {
            navigate({ to: '/' }, 'backward').then();
        }
    }, [wallet, navigate]);

    useEffect(() => {
        if (!wallet) return;
        const webApp = getTelegramWebApp();
        if (!webApp) return;

        const handleBackClick = () => {
            navigate({ to: '/' }, 'backward').then();
        };

        webApp.BackButton.show();
        webApp.BackButton.onClick(handleBackClick);

        return () => {
            webApp.BackButton.offClick(handleBackClick);
            webApp.BackButton.hide();
        };
    }, [navigate, wallet]);

    // Fetch balance
    const { data: balance, isLoading: isBalanceLoading } = useQuery({
        queryKey: ['balance', wallet?.address],
        queryFn: () => wallet && TonService.getBalance(wallet.address),
        enabled: !!wallet,
        refetchInterval: 10000,
    });

    // Fetch TON price in USD
    const { data: tonPrice } = useQuery({
        queryKey: ['ton-price'],
        queryFn: () => PriceService.getTONPrice(),
        refetchInterval: 60000, // Update every minute
    });

    const tonAmount = balance?.formatted ? parseFloat(balance.formatted) : 0;

    const formattedTonAmount = useMemo(() => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(tonAmount);
    }, [tonAmount]);

    const usdValue = tonPrice?.price ? tonAmount * tonPrice.price : null;

    const formattedUsdValue = useMemo(() => {
        if (usdValue === null) return null;
        return PriceService.formatUSD(usdValue);
    }, [usdValue]);

    const formattedTonPrice = useMemo(() => {
        if (!tonPrice?.price) return null;
        return PriceService.formatUSD(tonPrice.price);
    }, [tonPrice]);

    const priceChange24h = tonPrice?.change24h ?? 0;
    const isPriceUp = priceChange24h > 0;

    const handleSend = () => {
        triggerHapticImpact('medium');
        // TODO: Implement send modal
        console.warn('Send action is not implemented yet');
    };

    const handleReceive = () => {
        triggerHapticImpact('light');
        navigate({ to: '/wallet/receive' }, 'forward').then();
    };

    const handleLogout = () => {
        triggerHapticImpact('soft');
        WalletService.deleteWallet();
        setWallet(null);
        navigate({ to: '/' }, 'backward').then();
    };

    if (!wallet) return null;

    return (
        <div className={styles.wallet}>
            <GlassContainer variant="subtle">
                <div className={styles.panelHeader}>
                    <div className={styles.branding}>
                        <div className={styles.brandIcon}>
                            <Icon name='tonSymbol' size={32}/>
                        </div>
                        <div className={styles.brandText}>
                            <p className={styles.brandLabel}>Wallet</p>
                            <p className={styles.brandAddress}>
                                {truncateAddress(wallet.address, 6, 6)}
                            </p>
                        </div>
                    </div>
                    <button
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        title='Logout'
                    >
                        <LogOut size={18}/>
                    </button>
                </div>
            </GlassContainer>

            <GlassContainer className={styles.balanceCard} variant="subtle">
                {isBalanceLoading ? (
                    <div className={styles.balanceSkeleton}/>
                ) : (
                    <div className={styles.balanceContent}>
                        <div className={styles.balanceMain}>
                            <div className={styles.tonBalance}>
                                <span className={styles.tonAmount}>{formattedTonAmount}</span>
                                <span className={styles.tonSymbol}>TON</span>
                            </div>
                            {formattedUsdValue && (
                                <p className={styles.usdValue}>≈ {formattedUsdValue}</p>
                            )}
                        </div>

                        <div className={styles.priceDivider}/>

                        <div className={styles.priceInfo}>
                            <div className={styles.priceRow}>
                                <span className={styles.priceLabel}>TON Price</span>
                                <span className={styles.priceValue}>{formattedTonPrice ?? '—'}</span>
                            </div>
                            {priceChange24h !== 0 && (
                                <div className={styles.priceChangeRow}>
                                    <span className={styles.priceChangeLabel}>24h Change</span>
                                    <div className={styles.priceChange} data-trend={isPriceUp ? 'up' : 'down'}>
                                        {isPriceUp ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                        <span>{isPriceUp ? '+' : ''}{priceChange24h.toFixed(2)}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </GlassContainer>

            <QuickActions onSend={handleSend} onReceive={handleReceive}/>

        </div>
    );
}

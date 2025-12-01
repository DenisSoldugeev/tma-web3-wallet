import { GlassContainer } from '@components/ui/GlassContainer';
import { Icon } from '@components/ui/Icon';
import { QuickActions } from '@components/wallet/QuickActions';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { PriceService } from '@services/price';
import { TonService } from '@services/ton.ts';
import { WalletService } from '@services/wallet.ts';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { truncateAddress } from '@utils/format';
import { triggerHapticImpact } from '@utils/telegram';
import clsx from 'clsx';
import { LogOut, TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';

import styles from './WalletPage.module.scss';

import { Route } from '@/routes/wallet';

export function WalletPage() {
    const navigate = useTransitionNavigate();
    const wallet = useLoaderData({ from: Route.id });

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
        navigate({ to: '/wallet/send' }, 'forward').then();
    };

    const handleReceive = () => {
        triggerHapticImpact('light');
        navigate({ to: '/wallet/receive' }, 'forward').then();
    };

    const handleSwap = () => {
        triggerHapticImpact('medium');
        navigate({ to: '/wallet/swap' }, 'forward').then();
    };

    const handleLogout = () => {
        triggerHapticImpact('soft');
        WalletService.deleteWallet();
        navigate({ to: '/' }, 'backward').then();
    };

    return (
        <div className={clsx('page-container', styles['wallet'])}>
            <GlassContainer variant="subtle">
                <div className={styles['panel-header']}>
                    <div className={styles.branding}>
                        <div className={styles['brand-icon']}>
                            <Icon name='tonSymbol' size={32}/>
                        </div>
                        <div className={styles['brand-text']}>
                            <p className={styles['brand-label']}>Wallet</p>
                            <p className={styles['brand-address']}>
                                {truncateAddress(wallet.address, 6, 6)}
                            </p>
                        </div>
                    </div>
                    <button
                        className={styles['logout-button']}
                        onClick={handleLogout}
                        title='Logout'
                    >
                        <LogOut size={18}/>
                    </button>
                </div>
            </GlassContainer>

            <GlassContainer className={styles['balance-card']} variant="subtle">
                {isBalanceLoading ? (
                    <div className={styles['balance-skeleton']}/>
                ) : (
                    <div className={styles['balance-content']}>
                        <div className={styles['balance-main']}>
                            <div className={styles['ton-balance']}>
                                <span className={styles['ton-amount']}>{formattedTonAmount}</span>
                                <span className={styles['ton-symbol']}>TON</span>
                            </div>
                            {formattedUsdValue && (
                                <p className={styles['usd-value']}>≈ {formattedUsdValue}</p>
                            )}
                        </div>

                        <div className={styles['price-divider']}/>

                        <div className={styles['price-info']}>
                            <div className={styles['price-row']}>
                                <span className={styles['price-label']}>TON Price</span>
                                <span className={styles['price-value']}>{formattedTonPrice ?? '—'}</span>
                            </div>
                            {priceChange24h !== 0 && (
                                <div className={styles['price-change-row']}>
                                    <span className={styles['price-change-label']}>24h Change</span>
                                    <div className={styles['price-change']} data-trend={isPriceUp ? 'up' : 'down'}>
                                        {isPriceUp ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                        <span>{isPriceUp ? '+' : ''}{priceChange24h.toFixed(2)}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </GlassContainer>

            <QuickActions onSend={handleSend} onReceive={handleReceive} onSwap={handleSwap}/>

        </div>
    );
}

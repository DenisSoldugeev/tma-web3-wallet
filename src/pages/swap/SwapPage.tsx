import { GlassContainer } from '@components/ui/GlassContainer';
import { useBackButton } from '@hooks/useBackButton';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { TonService } from '@services/ton';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { MainButton } from '@twa-dev/sdk/react';
import { triggerHapticImpact } from '@utils/telegram';
import clsx from 'clsx';
import { ArrowDownUp } from 'lucide-react';
import { useCallback, useState } from 'react';

import styles from './SwapPage.module.scss';

import { Route } from '@/routes/wallet/swap';

export function SwapPage() {
  const navigate = useTransitionNavigate();
  const wallet = useLoaderData({ from: Route.id });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('TON');
  const [toToken, setToToken] = useState('USDT');
  const [isSwapping, setIsSwapping] = useState(false);

  // Fetch balance
  const { data: balance } = useQuery({
    queryKey: ['balance', wallet?.address],
    queryFn: () => wallet && TonService.getBalance(wallet.address),
    enabled: !!wallet,
  });

  // Handle back button
  const handleBack = useCallback(() => {
    navigate({ to: '/wallet' }, 'backward').then();
  }, [navigate]);

  useBackButton({ onBack: handleBack, enabled: true });

  const handleSwapTokens = () => {
    triggerHapticImpact('light');
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simulate exchange rate calculation
    if (value) {
      const rate = 0.5; // Example rate
      setToAmount((parseFloat(value) * rate).toFixed(6));
    } else {
      setToAmount('');
    }
  };

  const availableBalance = balance?.balance ? BigInt(balance.balance) : BigInt(0);
  const amountInNano = fromAmount ? BigInt(Math.floor(parseFloat(fromAmount) * 1e9)) : BigInt(0);
  const isAmountValid = fromAmount && amountInNano > 0 && amountInNano <= availableBalance;
  const canSwap = isAmountValid && !isSwapping;

  const handleSwap = async () => {
    if (!canSwap) return;

    triggerHapticImpact('medium');
    setIsSwapping(true);

    // Simulate swap operation
    setTimeout(() => {
      setIsSwapping(false);
      triggerHapticImpact('light');
      alert('Swap functionality coming soon!');
    }, 1500);
  };

  const formattedBalance = balance?.formatted || '0.0000';

  return (
    <div className={clsx('page-container', styles.swap)}>
      <h1 className={styles.title}>Swap Tokens</h1>

      <div className={styles.form}>
        <GlassContainer variant="subtle" className={styles.card}>
          <div className={styles.field}>
            <div className={styles['label-row']}>
              <label className={styles.label} htmlFor="from-amount">
                From
              </label>
              <span className={styles.balance}>Balance: {formattedBalance} {fromToken}</span>
            </div>
            <div className={styles['token-input']}>
              <input
                id="from-amount"
                type="number"
                className={styles.input}
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                disabled={isSwapping}
                step="0.01"
                min="0"
              />
              <div className={styles['token-selector']}>
                <span className={styles['token-symbol']}>{fromToken}</span>
              </div>
            </div>
            {fromAmount && !isAmountValid && (
              <p className={styles.error}>
                {amountInNano > availableBalance ? 'Insufficient balance' : 'Invalid amount'}
              </p>
            )}
          </div>
        </GlassContainer>

        <button
          className={styles['swap-button']}
          onClick={handleSwapTokens}
          disabled={isSwapping}
          type="button"
        >
          <ArrowDownUp size={20} />
        </button>

        <GlassContainer variant="subtle" className={styles.card}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="to-amount">
              To
            </label>
            <div className={styles['token-input']}>
              <input
                id="to-amount"
                type="number"
                className={styles.input}
                placeholder="0.0"
                value={toAmount}
                disabled
                readOnly
              />
              <div className={styles['token-selector']}>
                <span className={styles['token-symbol']}>{toToken}</span>
              </div>
            </div>
          </div>
        </GlassContainer>

        <GlassContainer variant="subtle" className={styles['info-card']}>
          <div className={styles['info-row']}>
            <span className={styles['info-label']}>Rate</span>
            <span className={styles['info-value']}>
              1 {fromToken} ≈ 0.5 {toToken}
            </span>
          </div>
          <div className={styles['info-row']}>
            <span className={styles['info-label']}>Fee</span>
            <span className={styles['info-value']}>~0.01 TON</span>
          </div>
          <div className={styles['info-row']}>
            <span className={styles['info-label']}>Slippage</span>
            <span className={styles['info-value']}>0.5%</span>
          </div>
        </GlassContainer>
      </div>

      <p className={styles.hint}>
        Swap functionality is coming soon. This is a preview of the interface.
      </p>

      <MainButton
        text={isSwapping ? 'Swapping...' : 'Swap Tokens'}
        onClick={handleSwap}
        disabled={!canSwap}
      />
    </div>
  );
}

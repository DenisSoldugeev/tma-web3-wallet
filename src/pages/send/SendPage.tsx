import { GlassContainer } from '@components/ui/GlassContainer';
import { useBackButton } from '@hooks/useBackButton';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { TonService } from '@services/ton';
import { WalletService } from '@services/wallet.ts';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { Address } from '@ton/ton';
import { MainButton } from '@twa-dev/sdk/react';
import { getTelegramWebApp, triggerHapticImpact } from '@utils/telegram';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

import styles from './SendPage.module.scss';

import { Route } from '@/routes/wallet/send';

export function SendPage() {
    const navigate = useTransitionNavigate();
    const wallet = useLoaderData({ from: Route.id });
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [isAddressValid, setIsAddressValid] = useState(false);
    const [isSending, setIsSending] = useState(false);

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

    useEffect(() => {
        try {
            if (recipientAddress) {
                Address.parse(recipientAddress);
                setIsAddressValid(true);
            } else {
                setIsAddressValid(false);
            }
        } catch {
            setIsAddressValid(false);
        }
    }, [recipientAddress]);

    const availableBalance = balance?.balance ? BigInt(balance.balance) : BigInt(0);
    const amountInNano = amount ? BigInt(Math.floor(parseFloat(amount) * 1e9)) : BigInt(0);
    const isAmountValid = amount && amountInNano > 0 && amountInNano <= availableBalance;
    const canSend = isAddressValid && isAmountValid && !isSending;

    const handleSend = async () => {
        if (!canSend) return;

        triggerHapticImpact('medium');
        setIsSending(true);

        try {
            // Get decrypted mnemonic
            const mnemonic = await WalletService.getMnemonic(wallet);

            // Send transaction
            await TonService.sendTransaction(
                wallet,
                mnemonic,
                recipientAddress,
                amountInNano,
                comment || undefined,
            );

            triggerHapticImpact('light');

            // Show success message
            const webApp = getTelegramWebApp();
            if (webApp) {
                webApp.showAlert('Transaction sent successfully!', () => {
                    navigate({ to: '/wallet' }, 'backward').then();
                });
            } else {
                alert('Transaction sent successfully!');
                navigate({ to: '/wallet' }, 'backward').then();
            }
        } catch (error) {
            console.error('Failed to send transaction:', error);
            triggerHapticImpact('heavy');

            const webApp = getTelegramWebApp();
            if (webApp) {
                webApp.showAlert('Failed to send transaction. Please try again.');
            } else {
                alert('Failed to send transaction. Please try again.');
            }
        } finally {
            setIsSending(false);
        }
    };

    const formattedBalance = balance?.formatted || '0.0000';

    return (
        <div className={clsx('page-container', styles.send)}>
            <h1 className={styles.title}>Send TON</h1>

            <div className={styles.form}>
                <GlassContainer variant="subtle" className={styles.card}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="recipient">
                            Recipient Address
                        </label>
                        <input
                            id="recipient"
                            type="text"
                            className={styles.input}
                            placeholder="UQAa..."
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value.trim())}
                            disabled={isSending}
                        />
                        {recipientAddress && !isAddressValid && (
                            <p className={styles.error}>Invalid TON address</p>
                        )}
                    </div>
                </GlassContainer>

                <GlassContainer variant="subtle" className={styles.card}>
                    <div className={styles.field}>
                        <div className={styles['label-row']}>
                            <label className={styles.label} htmlFor="amount">
                                Amount
                            </label>
                            <span className={styles.balance}>
                                Balance: {formattedBalance} TON
                            </span>
                        </div>
                        <div className={styles['amount-input']}>
                            <input
                                id="amount"
                                type="number"
                                className={styles.input}
                                placeholder="0.0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isSending}
                                step="0.01"
                                min="0"
                            />
                            <span className={styles.currency}>TON</span>
                        </div>
                        {amount && !isAmountValid && (
                            <p className={styles.error}>
                                {amountInNano > availableBalance
                                    ? 'Insufficient balance'
                                    : 'Invalid amount'}
                            </p>
                        )}
                    </div>
                </GlassContainer>

                <GlassContainer variant="subtle" className={styles.card}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="comment">
                            Comment (optional)
                        </label>
                        <input
                            id="comment"
                            type="text"
                            className={styles.input}
                            placeholder="Add a note..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSending}
                            maxLength={100}
                        />
                    </div>
                </GlassContainer>
            </div>

            <p className={styles.hint}>
                Make sure the recipient address is correct. Transactions cannot be reversed.
            </p>

            <MainButton
                text={isSending ? 'Sending...' : 'Send TON'}
                onClick={handleSend}
                disabled={!canSend}
            />
        </div>
    );
}

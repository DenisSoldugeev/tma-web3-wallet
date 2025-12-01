import { GlassContainer } from '@components/ui/GlassContainer';
import { useBackButton } from '@hooks/useBackButton';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { useLoaderData } from '@tanstack/react-router';
import { MainButton } from '@twa-dev/sdk/react';
import { triggerHapticImpact } from '@utils/telegram';
import clsx from 'clsx';
import QRCode from 'qrcode';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './ReceivePage.module.scss';

import { Route } from '@/routes/wallet/receive';

export function ReceivePage() {
    const navigate = useTransitionNavigate();
    const wallet = useLoaderData({ from: Route.id });
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [copied, setCopied] = useState(false);

    // Handle back button
    const handleBack = useCallback(() => {
        navigate({ to: '/wallet' }, 'backward').then();
    }, [navigate]);

    useBackButton({ onBack: handleBack, enabled: true });

    const transferLink = useMemo(() => {
        return `ton://transfer/${wallet.address}`;
    }, [wallet]);

    useEffect(() => {
        if (!transferLink) return;

        QRCode.toDataURL(transferLink, {
            width: 400,
            margin: 2,
            color: {
                dark: '#0B182F',
                light: '#FFFFFF',
            },
        })
            .then((url: string) => setQrDataUrl(url))
            .catch((error: unknown) => console.error('Failed to generate QR code:', error));
    }, [transferLink]);

    const handleCopy = async () => {
        triggerHapticImpact('light');
        try {
            await navigator.clipboard.writeText(wallet.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error('Copy failed:', error);
            alert('Failed to copy address');
        }
    };

    return (
        <div className={clsx('page-container', styles.receive)}>
            <h1 className={styles.title}>Receive TON</h1>

            <GlassContainer variant='default' size="lg" className={styles.card}>
                <div className={styles.qr}>
                    {qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR code" className={styles['qr-image']}/>
                    ) : (
                        <div className={styles['qr-skeleton']}/>
                    )}
                </div>
                <button className={styles.address} onClick={handleCopy}>
                    {wallet.address}
                </button>
                {copied && (
                    <GlassContainer variant="default" size="sm" className={styles.toast}>
                        Address copied to clipboard
                    </GlassContainer>
                )}
            </GlassContainer>
            <p className={styles['qr-hint']}>Scan the QR or share the address to receive TON</p>
            <MainButton
                text={copied ? 'Copied' : 'Copy address'}
                onClick={handleCopy}
            />
        </div>
    );
}

import { GlassContainer } from '@components/ui/GlassContainer';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { WalletService } from '@services/wallet.ts';
import { MainButton } from '@twa-dev/sdk/react';
import { getTelegramWebApp, triggerHapticImpact } from '@utils/telegram';
import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';

import styles from './ReceivePage.module.scss';

export function ReceivePage() {
    const navigate = useTransitionNavigate();
    const [wallet] = useState(WalletService.getWallet());
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!wallet) {
            navigate({ to: '/' }, 'backward').then();
            return;
        }

        const webApp = getTelegramWebApp();
        if (!webApp) return;

        const handleBackClick = () => {
            navigate({ to: '/wallet' }, 'backward').then();
        };

        webApp.BackButton.show();
        webApp.BackButton.onClick(handleBackClick);

        return () => {
            webApp.BackButton.offClick(handleBackClick);
            webApp.BackButton.hide();
        };
    }, [navigate, wallet]);

    const transferLink = useMemo(() => {
        if (!wallet) return '';
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

    if (!wallet) return null;

    const handleCopy = async () => {
        if (!wallet) return;
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
        <div className={styles.receive}>
            <h1 className={styles.title}>Receive TON</h1>
            <div className={styles.qr}>
                {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR code" className={styles.qrImage}/>
                ) : (
                    <div className={styles.qrSkeleton}/>
                )}
            </div>
            <GlassContainer variant="subtle" className={styles.card}>
                <div>
                    <p className={styles.label}>My address</p>
                    <p className={styles.address}>{wallet.address}</p>
                </div>
            </GlassContainer>
            <p className={styles.qrHint}>Scan the QR or share the address to receive TON</p>
            <MainButton
                text={copied ? 'Copied' : 'Copy address'}
                onClick={handleCopy}
            />
        </div>
    );
}

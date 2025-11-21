import { GlassContainer } from '@components/ui/GlassContainer';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { WalletService } from '@services/wallet.ts';
import { BackButton, MainButton } from '@twa-dev/sdk/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

import styles from './CreateWalletPage.module.scss';

export function CreateWalletPage() {
    const navigate = useTransitionNavigate();
    const [step, setStep] = useState<'intro' | 'mnemonic' | 'confirm'>('intro');
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateWallet = async () => {
        setIsCreating(true);
        try {
            const { mnemonic: generatedMnemonic } = await WalletService.createWallet();
            setMnemonic(generatedMnemonic);
            setStep('mnemonic');
        } catch (error) {
            console.error('Failed to create wallet:', error);
            alert('Failed to create wallet. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleConfirm = () => {
        navigate({ to: '/wallet' }, 'forward');
    };

    const handleBack = () => {
        navigate({ to: '/' }, 'backward');
    };

    return (
        <div className={styles['create-wallet-page']}>
            <div className={styles['create-wallet-page__content']}>
                {step === 'intro' && (
                    <div className={styles['create-wallet-page__step']}>
                        <h1 className={styles['create-wallet-page__title']}>Create New Wallet</h1>
                        <p className={styles['create-wallet-page__description']}>
                            You're about to create a new TON wallet. We'll generate a secure recovery phrase for you.
                        </p>

                        <GlassContainer variant="strong" className={styles['warning-card']}>
                            <div className={styles['warning-card__header']}>
                                <AlertTriangle size={20} strokeWidth={2} />
                                <h3 className={styles['warning-card__title']}>Important</h3>
                            </div>
                            <ul className={styles['warning-card__list']}>
                                <li className={styles['warning-card__item']}>Write down your recovery phrase and keep it safe</li>
                                <li className={styles['warning-card__item']}>Never share it with anyone</li>
                                <li className={styles['warning-card__item']}>Store it in a secure location</li>
                                <li className={styles['warning-card__item']}>You'll need it to recover your wallet</li>
                            </ul>
                        </GlassContainer>
                    </div>
                )}

                {step === 'mnemonic' && (
                    <div className={styles['create-wallet-page__step']}>
                        <h1 className={styles['create-wallet-page__title']}>Your Recovery Phrase</h1>
                        <p className={styles['create-wallet-page__description']}>
                            Write down these 24 words in order and keep them safe.
                        </p>

                        <GlassContainer variant="strong" className={styles['mnemonic-card']}>
                            <div className={styles['mnemonic-card__grid']}>
                                {mnemonic.map((word, index) => (
                                    <div key={index} className={styles['mnemonic-card__word']}>
                                        <span className={styles['mnemonic-card__word-number']}>{index + 1}</span>
                                        <span className={styles['mnemonic-card__word-text']}>{word}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassContainer>
                    </div>
                )}
            </div>

            {step === 'intro' && (
                <>
                    <BackButton onClick={handleBack}/>
                    <MainButton
                        text="Generate Wallet"
                        onClick={handleCreateWallet}
                        disabled={isCreating}
                        progress={isCreating}
                    />
                </>
            )}

            {step === 'mnemonic' && (
                <MainButton
                    text="I've Written It Down"
                    onClick={handleConfirm}
                />
            )}
        </div>
    );
}
import { useNavigate } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { WalletService } from '@services/wallet.service';
import styles from './CreateWalletPage.module.scss';

export function CreateWalletPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'intro' | 'mnemonic' | 'confirm'>('intro');
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const handleBack = useCallback(() => {
    if (step === 'intro') {
      navigate({ to: '/' });
    } else if (step === 'mnemonic') {
      setStep('intro');
    }
  }, [step, navigate]);

  // Show BackButton in Telegram
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
    navigate({ to: '/wallet' });
  };

  return (
    <div className={styles.create}>
      <div className={styles.content}>
        {step === 'intro' && (
          <div className={styles.step}>
            <h1 className={styles.title}>Create New Wallet</h1>
            <p className={styles.description}>
              You're about to create a new TON wallet. We'll generate a secure recovery phrase for you.
            </p>

            <Card className={styles.warningCard}>
              <h3>⚠️ Important</h3>
              <ul className={styles.warningList}>
                <li>Write down your recovery phrase and keep it safe</li>
                <li>Never share it with anyone</li>
                <li>Store it in a secure location</li>
                <li>You'll need it to recover your wallet</li>
              </ul>
            </Card>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCreateWallet}
                loading={isCreating}
              >
                Generate Wallet
              </Button>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => navigate({ to: '/' })}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 'mnemonic' && (
          <div className={styles.step}>
            <h1 className={styles.title}>Your Recovery Phrase</h1>
            <p className={styles.description}>
              Write down these 24 words in order and keep them safe.
            </p>

            <Card gradient className={styles.mnemonicCard}>
              <div className={styles.mnemonicGrid}>
                {mnemonic.map((word, index) => (
                  <div key={index} className={styles.mnemonicWord}>
                    <span className={styles.wordNumber}>{index + 1}</span>
                    <span className={styles.word}>{word}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleConfirm}
              >
                I've Written It Down
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
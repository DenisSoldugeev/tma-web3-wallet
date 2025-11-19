import { useNavigate } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { WalletService } from '@services/wallet.service';
import styles from './ImportWalletPage.module.scss';

export function ImportWalletPage() {
  const navigate = useNavigate();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleBack = useCallback(() => {
    navigate({ to: '/' });
  }, [navigate]);

  // Show BackButton in Telegram

  const handleImport = async () => {
    setError('');

    // Basic validation
    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 24) {
      setError('Recovery phrase must contain exactly 24 words');
      return;
    }

    setIsImporting(true);
    try {
      await WalletService.importWallet({ mnemonic: mnemonic.trim() });
      navigate({ to: '/wallet' });
    } catch {
      setError('Invalid recovery phrase. Please check and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className={styles.import}>
      <div className={styles.content}>
        <div className={styles.form}>
          <h1 className={styles.title}>Import Wallet</h1>
          <p className={styles.description}>
            Enter your 24-word recovery phrase to restore your wallet.
          </p>

          <Card gradient className={styles.inputCard}>
            <label className={styles.label}>Recovery Phrase</label>
            <textarea
              className={styles.textarea}
              placeholder="Enter your 24-word recovery phrase separated by spaces..."
              rows={6}
              value={mnemonic}
              onChange={(e) => {
                setMnemonic(e.target.value);
                setError('');
              }}
            />
            {error && <p className={styles.error}>{error}</p>}
          </Card>

          <Card className={styles.infoCard}>
            <h3>🔒 Security Tips</h3>
            <ul className={styles.tipsList}>
              <li>Make sure you're in a private space</li>
              <li>Never share your recovery phrase</li>
              <li>Check for typos carefully</li>
              <li>Words must be in the correct order</li>
            </ul>
          </Card>

          <div className={styles.actions}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleImport}
              loading={isImporting}
              disabled={!mnemonic.trim()}
            >
              Import Wallet
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
      </div>
    </div>
  );
}
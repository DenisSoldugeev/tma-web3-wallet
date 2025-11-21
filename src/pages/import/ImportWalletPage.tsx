import { GlassContainer } from '@components/ui/GlassContainer';
import { useTransitionNavigate } from '@hooks/useTransitionNavigate';
import { WalletService } from '@services/wallet.ts';
import { BackButton, MainButton } from '@twa-dev/sdk/react';
import { Shield } from 'lucide-react';
import { useState } from 'react';

import styles from './ImportWalletPage.module.scss';

export function ImportWalletPage() {
  const navigate = useTransitionNavigate();
  const [words, setWords] = useState<string[]>(Array(24).fill(''));
  const [error, setError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value.toLowerCase().trim();
    setWords(newWords);
    setError('');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedWords = pastedText.trim().split(/\s+/).slice(0, 24);

    const newWords = [...words];
    pastedWords.forEach((word, index) => {
      if (index < 24) {
        newWords[index] = word.toLowerCase().trim();
      }
    });
    setWords(newWords);
    setError('');
  };

  const handleImport = async () => {
    setError('');

    const filledWords = words.filter(word => word.trim() !== '');
    if (filledWords.length !== 24) {
      setError('Please fill in all 24 words');
      return;
    }

    setIsImporting(true);
    try {
      const mnemonic = words.join(' ');
      await WalletService.importWallet({ mnemonic });
      navigate({ to: '/wallet' }, 'forward');
    } catch {
      setError('Invalid recovery phrase. Please check and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const filledWordsCount = words.filter(word => word.trim() !== '').length;
  const isComplete = filledWordsCount === 24;

  return (
    <div className={styles['import-page']}>
      <BackButton onClick={() => navigate({ to: '/' }, 'backward')} />

      {isComplete && (
        <MainButton
          text={isImporting ? 'Importing...' : 'Import Wallet'}
          disabled={isImporting}
          onClick={handleImport}
        />
      )}

      <div className={styles['import-page__content']}>
        <div className={styles['import-page__header']}>
          <h1 className={styles['import-page__title']}>Import Wallet</h1>
          <p className={styles['import-page__subtitle']}>
            Enter your 24-word recovery phrase to restore your wallet
          </p>
        </div>

        <GlassContainer variant="strong" className={styles['import-page__card']}>
          <div className={styles['import-page__card-header']}>
            <span className={styles['import-page__label']}>Recovery Phrase</span>
            <span className={styles['import-page__progress']}>
              {filledWordsCount}/24 words
            </span>
          </div>

          <div className={styles['import-page__grid']} onPaste={handlePaste}>
            {words.map((word, index) => (
              <div key={index} className={styles['import-page__input-wrapper']}>
                <span className={styles['import-page__input-number']}>{index + 1}</span>
                <input
                  type="text"
                  className={styles['import-page__input']}
                  placeholder="word"
                  value={word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className={styles['import-page__error']}>
              {error}
            </div>
          )}
        </GlassContainer>

        <GlassContainer variant="strong" className={styles['import-page__info-card']}>
          <div className={styles['import-page__info-header']}>
            <Shield size={20} />
            <h3>Security Tips</h3>
          </div>
          <ul className={styles['import-page__tips-list']}>
            <li>Make sure you're in a private space</li>
            <li>Never share your recovery phrase</li>
            <li>Check for typos carefully</li>
            <li>Words must be in the correct order</li>
            <li>You can paste all 24 words at once</li>
          </ul>
        </GlassContainer>
      </div>

      <div className={styles['import-page__footer']}>
        <p className={styles['import-page__footer-text']}>
          Your recovery phrase is never stored or transmitted
        </p>
        <p className={styles['import-page__footer-subtitle']}>
          All wallet operations happen locally on your device
        </p>
      </div>
    </div>
  );
}

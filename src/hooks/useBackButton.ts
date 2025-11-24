import { getTelegramWebApp } from '@utils/telegram';
import { useEffect } from 'react';

interface UseBackButtonOptions {
    onBack: () => void;
    enabled?: boolean;
}

export function useBackButton({ onBack, enabled = true }: UseBackButtonOptions) {
    useEffect(() => {
        if (!enabled) return;

        const webApp = getTelegramWebApp();
        if (!webApp) return;

        webApp.BackButton.show();
        webApp.BackButton.onClick(onBack);

        return () => {
            webApp.BackButton.offClick(onBack);
            webApp.BackButton.hide();
        };
    }, [onBack, enabled]);
}

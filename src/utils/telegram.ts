import type { WebApp as TelegramWebApp } from '@twa-dev/types';

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.Telegram?.WebApp ?? null;
}

export function isTelegramEnvironment(): boolean {
  const webApp = getTelegramWebApp();
  return !!webApp?.initData;
}

function isMobilePlatform(platform: string): boolean {
  return ['android', 'ios'].includes(platform.toLowerCase());
}

export function initTelegramApp(): void {
  const webApp = getTelegramWebApp();
  if (!webApp) {
    console.warn('Not running in Telegram environment');
    return;
  }

  const isMobile = isMobilePlatform(webApp.platform);

  if (isMobile) {
    webApp.requestFullscreen();
  } else {
    webApp.expand();
  }

  webApp.ready();

  console.warn('Telegram Mini App initialized', {
    version: webApp.version,
    platform: webApp.platform,
    mode: isMobile ? 'fullscreen' : 'expanded',
  });
}

export function triggerHapticImpact(
  style: Parameters<
    TelegramWebApp['HapticFeedback']['impactOccurred']
  >[0] = 'light',
): void {
  const webApp = getTelegramWebApp();
  webApp?.HapticFeedback?.impactOccurred(style);
}

/// <reference types="@twa-dev/sdk" />

import type { WebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export {};

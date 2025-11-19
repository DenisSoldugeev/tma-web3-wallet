import WebApp from '@twa-dev/sdk'

export function isTelegramEnvironment(): boolean {
  const webapp = window.Telegram?.WebApp
  if (!webapp) {
    return false
  }
  return !!(webapp.initData)
}

export function initTelegramApp(): void {
  if (!isTelegramEnvironment()) {
    console.warn('Not running in Telegram environment')
    return
  }

  WebApp.expand()
  WebApp.ready()

  console.log('Telegram Mini App initialized', {
    version: WebApp.version,
    platform: WebApp.platform,
  })
}

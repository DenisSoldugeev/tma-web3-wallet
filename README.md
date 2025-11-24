# TMA Wallet

A demonstration project of a TON wallet as a Telegram Mini App. Created as an example/starter pack for learning how to work with Telegram Mini Apps API and Web3 integration with TON blockchain.

> **📚 This is an educational project for demonstration purposes**
>
> The project shows how to integrate TON blockchain into a Telegram Mini App using a modern technology stack. Recommended for use only in testnet for learning and experimentation.

## Features

- 🔐 Wallet creation with 24-word mnemonic phrase
- 📥 Import existing wallet
- 💎 Support for Wallet V5R1 (W5) - the latest TON standard
- 💰 View wallet balance and transaction history
- 📤 Send TON with address validation
- 📥 Receive TON with QR code generation
- 📱 Integration with Telegram Mini Apps
- ✨ Modern UI with glass morphism design and smooth transitions

## Technologies

### Frontend
- **React 19** - UI library
- **Vite 7.2** - build tool with fast HMR
- **TypeScript 5.9** - type safety
- **SCSS Modules** - component styling

### Routing & State
- **Tanstack Router** - file-based routing with type-safety
- **Tanstack Query** - server state management and caching

### TON Blockchain
- **@ton/ton** - TON blockchain interaction
- **@ton/crypto** - cryptographic operations and mnemonics
- **WalletContractV5R1** - latest wallet contract version

### Telegram
- WebApp initialization and Telegram UI integration

## Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file (copy from `.env.example`):

```env
VITE_TON_API_ENDPOINT=https://testnet.toncenter.com/api/v2/jsonRPC
VITE_TON_API_KEY=your_api_key_here
```

### Running

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

## Architecture

### Project Structure

```
src/
├── components/ui/     # Base UI elements (Button, Card, Icon, GlassContainer)
├── pages/             # Application pages
│   ├── welcome/       # Welcome page
│   ├── create/        # Wallet creation
│   ├── import/        # Wallet import
│   ├── wallet/        # Main wallet page
│   ├── send/          # Send TON page
│   └── receive/       # Receive TON page with QR
├── services/          # Business logic
│   ├── wallet.ts      # Wallet management (V5R1)
│   ├── ton.ts         # Blockchain interaction
│   └── storage.ts     # LocalStorage wrapper
├── routes/            # File-based routing (auto-generated tree)
├── hooks/             # Custom hooks (useBackButton, useTransitionNavigate)
├── utils/             # Utilities (Telegram, encryption, route guards)
└── styles/            # SCSS modules with mixins and variables
```

### Service Layer

**WalletService** - Wallet creation/import, mnemonic generation (24 words), WalletContractV5R1 initialization

**TonService** - Blockchain interaction via TonClient: balances, transaction history, sending transactions

**StorageService** - Encrypted localStorage persistence (key: `tma_wallet`)

### Path Aliases

```typescript
import { WalletService } from '@services/wallet';
import { GlassContainer } from '@components/ui/GlassContainer';
// @/ @components/ @services/ @utils/ @pages/ @hooks/ @styles/
```

## TON Wallet V5R1

Uses the latest **Wallet V5R1 (W5)** standard with 25% lower fees, gasless transaction support, and up to 255 parallel transactions. Non-bounceable addresses with `UQ` prefix.

**Wallet Creation Flow:** Mnemonic (24 words) → Keypair → WalletContractV5R1 → Address → LocalStorage

## Telegram Integration

Full Telegram Mini App integration with theme adaptation and back button handling.

**Local Testing:** Use [ngrok](https://ngrok.com/) to tunnel dev server (`ngrok http 5173`), then create bot via [@BotFather](https://t.me/BotFather) and set the ngrok URL.

## Styling

**SCSS Modules** with glass morphism design system (`backdrop-filter: blur()`), Telegram theme variables (`var(--tg-theme-bg-color)`), and shared mixins for responsive layouts and safe areas.

**View Transitions API** for smooth page navigation with hardware acceleration.

## Deployment

Ready for GitHub Pages, Vercel, or Netlify. Build: `npm run build` → `dist/`

## Resources

[TON Docs](https://docs.ton.org/) • [Telegram Mini Apps](https://core.telegram.org/bots/webapps) • [Wallet V5 Spec](https://github.com/ton-blockchain/wallet-contract-v5) • [Tanstack Router](https://tanstack.com/router/latest) • [Tanstack Query](https://tanstack.com/query/latest)

## License

MIT

---

Created as an example for learning TON blockchain integration into Telegram Mini Apps.
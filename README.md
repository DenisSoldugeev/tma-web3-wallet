# TMA Wallet

A demonstration project of a TON wallet as a Telegram Mini App. Created as an example/starter pack for learning how to work with Telegram Mini Apps API and Web3 integration with TON blockchain.

> **📚 This is an educational project for demonstration purposes**
>
> The project shows how to integrate TON blockchain into a Telegram Mini App using a modern technology stack. Recommended for use only in testnet for learning and experimentation.

## Features

- 🔐 Wallet creation with 24-word mnemonic phrase
- 📥 Import existing wallet
- 💎 Support for Wallet V5R1 (W5) - the latest TON standard
- 💰 View wallet balance
- 📱 Integration with Telegram Mini Apps
- ✨ Modern UI with smooth transitions

## Technologies

### Frontend
- **React 19** - UI library
- **Vite 7.2** - build tool with fast HMR
- **TypeScript 5.9** - type safety
- **SCSS Modules** - component styling

### Routing & State
- **Tanstack Router** - file-based routing with type-safety
- **Tanstack Query** - server state management and caching
- **Framer Motion** - animations and transitions

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
├── components/         # UI components
│   ├── ui/            # Base elements (Button, Card, Input)
│   ├── wallet/        # Wallet components
│   └── layout/        # Layout components
├── pages/             # Application pages
│   ├── welcome/       # Welcome page
│   ├── create/        # Wallet creation
│   ├── import/        # Wallet import
│   └── wallet/        # Main wallet page
├── services/          # Business logic
│   ├── wallet.ts      # Wallet management
│   ├── ton.ts         # Blockchain interaction
│   └── storage.service.ts  # Data storage
├── routes/            # File-based routing
├── hooks/             # Custom React hooks
├── utils/             # Utilities
└── styles/            # Global styles
```

### Service Layer

**WalletService** - Wallet Management
- Generate mnemonic phrases (24 words)
- Create WalletContractV5R1 with non-bounceable addresses
- Import wallets from mnemonic
- Store in localStorage

**TonService** - Blockchain Interaction
- Connect to TON via TonClient
- Fetch wallet balances
- Transaction history
- Send transactions (in development)

**StorageService** - Local Storage
- Save wallet data to localStorage
- Storage key: `tma_wallet`

### Path Aliases

Convenient aliases configured for imports:

```
@/             → src/
@components/   → src/components/
@services/     → src/services/
@utils/        → src/utils/
@pages/        → src/pages/
@hooks/        → src/hooks/
@styles/       → src/styles/
```

## TON Wallet V5R1

The project uses the latest TON wallet standard - **Wallet V5R1 (W5)**:

- Reduced fees (25% lower than V4)
- Support for gasless transactions
- Ability to execute up to 255 transactions in parallel
- Non-bounceable addresses (`UQ` prefix)

### How Wallet Creation Works

1. Generate 24-word mnemonic phrase
2. Validate mnemonic
3. Create keypair from mnemonic
4. Initialize WalletContractV5R1 contract
5. Get non-bounceable address
6. Save to localStorage

## Telegram Integration

The app works as a Telegram Mini App:

- Telegram environment check
- Expand WebApp to full screen
- Notify Telegram when app is ready

### Testing in Telegram

Use [ngrok](https://ngrok.com/) for local testing:

```bash
ngrok http 5173
```

Then create a bot via [@BotFather](https://t.me/BotFather) and set the ngrok URL as the Mini App address.

## Styling
### Telegram Themes

Uses Telegram CSS variables to integrate with user's theme:

```
background: var(--tg-theme-bg-color);
color: var(--tg-theme-text-color);
```

## Deployment

The project is ready for deployment on:
- GitHub Pages
- Vercel
- Netlify

Build command: `npm run build`
Output directory: `dist`

## Useful Links

### Documentation
- [TON Documentation](https://docs.ton.org/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Wallet V5 Specification](https://github.com/ton-blockchain/wallet-contract-v5)

### Libraries
- [Tanstack Router](https://tanstack.com/router/latest)
- [Tanstack Query](https://tanstack.com/query/latest)
## License

MIT

---

Created as an example for learning TON blockchain integration into Telegram Mini Apps.
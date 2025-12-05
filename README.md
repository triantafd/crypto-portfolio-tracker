# Crypto Portfolio Tracker

📱 A modern React Native mobile app for tracking cryptocurrency prices and managing your portfolio. Features real-time market data from CoinGecko, transaction-based portfolio tracking (buy/sell/transfer), profit/loss calculations, interactive price charts, favorites system, and detailed coin analytics.

## Features

- 📊 **Market Overview**: Browse and track cryptocurrency prices in real-time
- ⭐ **Favorites**: Save your favorite coins for quick access
- 💼 **Portfolio Management**: Track your crypto holdings with transaction-based system
  - Add buy/sell/transfer transactions
  - Automatic profit/loss calculations
  - Cost basis and average buy price tracking
  - 24h and all-time profit tracking
- 📈 **Price Charts**: Interactive charts with multiple time ranges (1D, 7D, 30D, 90D, 1Y)
- 🔍 **Coin Details**: Detailed information for each cryptocurrency
- 🎨 **Modern UI**: Dark theme with NativeWind (Tailwind CSS for React Native)

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand with AsyncStorage persistence
- **Data Fetching**: TanStack Query (React Query) with caching
- **Styling**: NativeWind (Tailwind CSS)
- **Charts**: Custom SVG-based chart implementation
- **API**: CoinGecko API
- **Ads**: Google Mobile Ads (AdMob)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI (optional, comes with npm install)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Running on Device

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests (placeholder)

## Project Structure

```
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Market/Home screen
│   │   ├── favorites.tsx  # Favorites screen
│   │   └── portfolio.tsx  # Portfolio screen
│   └── [id].tsx           # Coin detail screen
├── components/            # Reusable components
│   ├── portfolio/        # Portfolio-specific components
│   └── ads/              # Ad components
├── lib/                  # Utilities and API
│   ├── api.ts           # CoinGecko API client
│   ├── queryClient.ts   # React Query configuration
│   ├── ads.ts           # Google Ads setup
│   └── portfolioCalculations.ts  # Portfolio math
├── store/               # Zustand state management
│   └── useStore.ts      # Main store with transactions
└── components/          # UI components
```

## GitLab CI/CD

The project includes GitLab CI configuration (`.gitlab-ci.yml`) that runs:

- ✅ **ESLint**: Code quality checks
- ✅ **TypeScript**: Type checking
- ✅ **Tests**: Test execution (when tests are added)

No builds are performed in CI - use EAS Build or local builds for that.

## Google Ads Setup

See [GOOGLE_ADS_SETUP.md](./GOOGLE_ADS_SETUP.md) for instructions on setting up Google Mobile Ads.

## License

Private project


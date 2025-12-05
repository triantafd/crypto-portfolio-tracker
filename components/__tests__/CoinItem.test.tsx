import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import CoinItem from '../CoinItem';
import { Coin } from '../../lib/api';

const mockCoin: Coin = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  image: 'https://example.com/bitcoin.png',
  current_price: 50000,
  market_cap: 1000000000,
  market_cap_rank: 1,
  price_change_percentage_24h: 5.5,
};

// Mock expo-router
jest.mock('expo-router', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => {
    const { View } = require('react-native');
    return <View testID={`link-${href}`}>{children}</View>;
  },
}));

describe('CoinItem', () => {
  it('should render coin information correctly', async () => {
    const { getByText } = render(<CoinItem coin={mockCoin} />);
    // Wait for async icon loading

    expect(getByText('Bitcoin')).toBeTruthy();

    // Symbol is displayed as uppercase in component
    expect(getByText(/BTC/i)).toBeTruthy();
    expect(getByText('$50,000')).toBeTruthy();
  });

  it('should display positive price change correctly', () => {
    const { getByText } = render(<CoinItem coin={mockCoin} />);
    expect(getByText('5.50%')).toBeTruthy();
  });

  it('should display negative price change correctly', () => {
    const negativeCoin: Coin = {
      ...mockCoin,
      price_change_percentage_24h: -3.2,
    };
    const { getByText } = render(<CoinItem coin={negativeCoin} />);
    expect(getByText('3.20%')).toBeTruthy();
  });

  it('should link to coin details page', () => {
    const { getByTestId } = render(<CoinItem coin={mockCoin} />);
    expect(getByTestId('link-/bitcoin')).toBeTruthy();
  });
});


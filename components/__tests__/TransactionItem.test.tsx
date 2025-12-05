import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TransactionItem from '../TransactionItem';
import { Transaction } from '../../store/useStore';

const mockTransaction: Transaction = {
  id: '1',
  coinId: 'bitcoin',
  type: 'buy',
  amountCrypto: 1.5,
  amountFiat: 45000,
  date: '2024-01-01T00:00:00.000Z',
};

describe('TransactionItem', () => {
  it('should render transaction correctly', () => {
    const { getByText } = render(
      <TransactionItem
        transaction={mockTransaction}
        coinName="Bitcoin"
        coinSymbol="BTC"
      />
    );
    expect(getByText('buy')).toBeTruthy();
    // Coin name is shown as "• Bitcoin" in the component
    expect(getByText(/Bitcoin/)).toBeTruthy();
    expect(getByText(/1.5/)).toBeTruthy();
  });

  it('should show negative sign for sell transactions', () => {
    const sellTx: Transaction = {
      ...mockTransaction,
      type: 'sell',
    };
    const { getByText } = render(
      <TransactionItem transaction={sellTx} coinSymbol="BTC" />
    );
    expect(getByText(/-1.5/)).toBeTruthy();
  });

  it('should show positive sign for buy transactions', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockTransaction} coinSymbol="BTC" />
    );
    expect(getByText(/\+1.5/)).toBeTruthy();
  });

  it('should call onDelete when delete button is pressed', () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <TransactionItem
        transaction={mockTransaction}
        onDelete={onDelete}
        coinSymbol="BTC"
      />
    );
    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });

  it('should not show delete button when onDelete is not provided', () => {
    const { queryByTestId } = render(
      <TransactionItem transaction={mockTransaction} coinSymbol="BTC" />
    );
    expect(queryByTestId('delete-button')).toBeNull();
  });

  it('should display formatted date', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockTransaction} coinSymbol="BTC" />
    );
    // Date format: "Jan 1, 2024"
    expect(getByText(/Jan/)).toBeTruthy();
  });
});


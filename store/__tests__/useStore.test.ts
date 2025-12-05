import { useStore } from '../useStore';
import { Transaction } from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({
      favorites: [],
      transactions: [],
      portfolio: {},
      migrated: false,
    });
  });

  describe('favorites', () => {
    it('should add favorite', () => {
      const { addFavorite } = useStore.getState();
      addFavorite('bitcoin');
      expect(useStore.getState().favorites).toContain('bitcoin');
    });

    it('should not add duplicate favorites', () => {
      const { addFavorite } = useStore.getState();
      addFavorite('bitcoin');
      addFavorite('bitcoin');
      expect(useStore.getState().favorites).toHaveLength(1);
    });

    it('should remove favorite', () => {
      const { addFavorite, removeFavorite } = useStore.getState();
      addFavorite('bitcoin');
      removeFavorite('bitcoin');
      expect(useStore.getState().favorites).not.toContain('bitcoin');
    });
  });

  describe('transactions', () => {
    it('should add transaction', () => {
      const { addTransaction } = useStore.getState();
      const transaction: Omit<Transaction, 'id'> = {
        coinId: 'bitcoin',
        type: 'buy',
        amountCrypto: 1,
        amountFiat: 40000,
        date: '2024-01-01',
      };
      addTransaction(transaction);
      expect(useStore.getState().transactions).toHaveLength(1);
      expect(useStore.getState().transactions[0].coinId).toBe('bitcoin');
    });

    it('should delete transaction', () => {
      const { addTransaction, deleteTransaction } = useStore.getState();
      const transaction: Omit<Transaction, 'id'> = {
        coinId: 'bitcoin',
        type: 'buy',
        amountCrypto: 1,
        amountFiat: 40000,
        date: '2024-01-01',
      };
      addTransaction(transaction);
      const txId = useStore.getState().transactions[0].id;
      deleteTransaction(txId);
      expect(useStore.getState().transactions).toHaveLength(0);
    });

    it('should get transactions by coin', () => {
      const { addTransaction, getTransactionsByCoin } = useStore.getState();
      addTransaction({
        coinId: 'bitcoin',
        type: 'buy',
        amountCrypto: 1,
        amountFiat: 40000,
        date: '2024-01-01',
      });
      addTransaction({
        coinId: 'ethereum',
        type: 'buy',
        amountCrypto: 10,
        amountFiat: 30000,
        date: '2024-01-01',
      });
      const btcTxs = getTransactionsByCoin('bitcoin');
      expect(btcTxs).toHaveLength(1);
      expect(btcTxs[0].coinId).toBe('bitcoin');
    });

    it('should calculate holdings correctly', () => {
      const { addTransaction, getHoldings } = useStore.getState();
      addTransaction({
        coinId: 'bitcoin',
        type: 'buy',
        amountCrypto: 1.5,
        amountFiat: 45000,
        date: '2024-01-01',
      });
      addTransaction({
        coinId: 'bitcoin',
        type: 'sell',
        amountCrypto: 0.3,
        amountFiat: 15000,
        date: '2024-02-01',
      });
      expect(getHoldings('bitcoin')).toBe(1.2);
    });

    it('should calculate cost basis correctly', () => {
      const { addTransaction, getCostBasis } = useStore.getState();
      addTransaction({
        coinId: 'bitcoin',
        type: 'buy',
        amountCrypto: 1,
        amountFiat: 40000,
        fee: 100,
        date: '2024-01-01',
      });
      expect(getCostBasis('bitcoin')).toBe(40100);
    });

    it('should get all coin IDs', () => {
      const { addTransaction, getAllCoinIds } = useStore.getState();
      addTransaction({
        coinId: 'bitcoin',
        type: 'buy',
        amountCrypto: 1,
        amountFiat: 40000,
        date: '2024-01-01',
      });
      addTransaction({
        coinId: 'ethereum',
        type: 'buy',
        amountCrypto: 10,
        amountFiat: 30000,
        date: '2024-01-01',
      });
      const coinIds = getAllCoinIds();
      expect(coinIds).toContain('bitcoin');
      expect(coinIds).toContain('ethereum');
      expect(coinIds).toHaveLength(2);
    });
  });
});


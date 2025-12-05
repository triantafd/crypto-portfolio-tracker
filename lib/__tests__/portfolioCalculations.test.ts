import {
  calculateHoldings,
  calculateCostBasis,
  calculateCurrentValue,
  calculateAllTimeProfit,
  calculate24hProfit,
} from '../portfolioCalculations';
import { Transaction } from '../../store/useStore';

describe('portfolioCalculations', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      coinId: 'bitcoin',
      type: 'buy',
      amountCrypto: 1.5,
      amountFiat: 45000,
      date: '2024-01-01',
    },
    {
      id: '2',
      coinId: 'bitcoin',
      type: 'buy',
      amountCrypto: 0.5,
      amountFiat: 20000,
      date: '2024-02-01',
    },
    {
      id: '3',
      coinId: 'bitcoin',
      type: 'sell',
      amountCrypto: 0.3,
      amountFiat: 15000,
      date: '2024-03-01',
    },
  ];

  describe('calculateHoldings', () => {
    it('should calculate total holdings correctly', () => {
      expect(calculateHoldings(mockTransactions, 'bitcoin')).toBe(1.7); // 1.5 + 0.5 - 0.3
    });

    it('should return 0 for non-existent coin', () => {
      expect(calculateHoldings(mockTransactions, 'ethereum')).toBe(0);
    });

    it('should handle transfer transactions', () => {
      const transferTx: Transaction = {
        id: '4',
        coinId: 'bitcoin',
        type: 'transfer',
        amountCrypto: 0.2,
        amountFiat: 0,
        date: '2024-04-01',
      };
      expect(calculateHoldings([...mockTransactions, transferTx], 'bitcoin')).toBe(1.9);
    });
  });

  describe('calculateCostBasis', () => {
    it('should calculate cost basis correctly', () => {
      // 45000 + 20000 - 15000 = 50000
      expect(calculateCostBasis(mockTransactions, 'bitcoin')).toBe(50000);
    });

    it('should include fees in cost basis', () => {
      const txWithFee: Transaction = {
        id: '5',
        coinId: 'bitcoin',
        type: 'buy',
        amountCrypto: 1,
        amountFiat: 40000,
        fee: 100,
        date: '2024-05-01',
      };
      expect(calculateCostBasis([txWithFee], 'bitcoin')).toBe(40100);
    });
  });

  describe('calculateCurrentValue', () => {
    it('should calculate current value correctly', () => {
      expect(calculateCurrentValue(1.7, 50000)).toBe(85000);
    });

    it('should return 0 for zero holdings', () => {
      expect(calculateCurrentValue(0, 50000)).toBe(0);
    });
  });

  describe('calculateAllTimeProfit', () => {
    it('should calculate profit correctly', () => {
      const result = calculateAllTimeProfit(100000, 50000);
      expect(result.profit).toBe(50000);
      expect(result.profitPercent).toBe(100);
    });

    it('should handle negative profit', () => {
      const result = calculateAllTimeProfit(30000, 50000);
      expect(result.profit).toBe(-20000);
      expect(result.profitPercent).toBe(-40);
    });

    it('should handle zero cost basis', () => {
      const result = calculateAllTimeProfit(100000, 0);
      expect(result.profit).toBe(100000);
      expect(result.profitPercent).toBe(0); // Function returns 0 when costBasis is 0
    });
  });

  describe('calculate24hProfit', () => {
    it('should calculate 24h profit correctly', () => {
      const result = calculate24hProfit(1.7, 50000, 45000);
      expect(result.profit).toBe(8500); // 1.7 * (50000 - 45000)
      expect(result.profitPercent).toBeCloseTo(11.11, 2);
    });

    it('should handle negative 24h profit', () => {
      const result = calculate24hProfit(1.7, 45000, 50000);
      expect(result.profit).toBe(-8500); // 1.7 * (45000 - 50000)
      // profitPercent = (-8500 / 85000) * 100 = -10%
      expect(result.profitPercent).toBeCloseTo(-10, 2);
    });
  });
});


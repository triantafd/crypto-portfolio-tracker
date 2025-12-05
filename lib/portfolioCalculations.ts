import { Transaction } from "../store/useStore";

/**
 * Calculate total holdings (crypto amount) from transactions
 */
export function calculateHoldings(
  transactions: Transaction[],
  coinId: string
): number {
  const coinTransactions = transactions.filter((tx) => tx.coinId === coinId);
  return coinTransactions.reduce((total, tx) => {
    if (tx.type === "buy" || tx.type === "transfer") {
      return total + tx.amountCrypto;
    } else if (tx.type === "sell") {
      return total - tx.amountCrypto;
    }
    return total;
  }, 0);
}

/**
 * Calculate cost basis (total USD invested)
 */
export function calculateCostBasis(
  transactions: Transaction[],
  coinId: string
): number {
  const coinTransactions = transactions.filter((tx) => tx.coinId === coinId);
  return coinTransactions.reduce((total, tx) => {
    if (tx.type === "buy") {
      return total + tx.amountFiat + (tx.fee || 0);
    } else if (tx.type === "sell") {
      return total - tx.amountFiat + (tx.fee || 0);
    }
    return total;
  }, 0);
}

/**
 * Calculate average buy price
 */
export function calculateAvgBuyPrice(
  transactions: Transaction[],
  coinId: string
): number {
  const holdings = calculateHoldings(transactions, coinId);
  const costBasis = calculateCostBasis(transactions, coinId);
  if (holdings <= 0) return 0;
  return costBasis / holdings;
}

/**
 * Calculate current value
 */
export function calculateCurrentValue(
  holdings: number,
  currentPrice: number
): number {
  return holdings * currentPrice;
}

/**
 * Calculate all-time profit
 */
export function calculateAllTimeProfit(
  currentValue: number,
  costBasis: number
): { profit: number; profitPercent: number } {
  const profit = currentValue - costBasis;
  const profitPercent = costBasis > 0 ? (profit / costBasis) * 100 : 0;
  return { profit, profitPercent };
}

/**
 * Calculate 24h profit
 */
export function calculate24hProfit(
  holdings: number,
  currentPrice: number,
  price24hAgo: number
): { profit: number; profitPercent: number } {
  const profit = holdings * (currentPrice - price24hAgo);
  const value24hAgo = holdings * price24hAgo;
  const profitPercent = value24hAgo > 0 ? (profit / value24hAgo) * 100 : 0;
  return { profit, profitPercent };
}

/**
 * Get all unique coin IDs from transactions
 */
export function getCoinIdsFromTransactions(transactions: Transaction[]): string[] {
  const coinIds = new Set<string>();
  transactions.forEach((tx) => coinIds.add(tx.coinId));
  return Array.from(coinIds);
}


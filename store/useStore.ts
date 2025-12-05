import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Legacy interface for backward compatibility
interface PortfolioItem {
  amount: number;
}

export interface Transaction {
  id: string;
  coinId: string;
  type: "buy" | "sell" | "transfer";
  amountCrypto: number;
  amountFiat: number;
  date: string; // ISO string
  fee?: number;
  notes?: string;
}

interface StoreState {
  favorites: string[];
  portfolio: Record<string, PortfolioItem>; // Keep for backward compat
  transactions: Transaction[];
  migrated: boolean; // Track if we've migrated old portfolio data
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  // Legacy portfolio methods (kept for backward compat)
  updatePortfolio: (id: string, amount: number) => void;
  removePortfolioItem: (id: string) => void;
  // New transaction methods
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByCoin: (coinId: string) => Transaction[];
  // Calculation helpers
  getHoldings: (coinId: string) => number;
  getCostBasis: (coinId: string) => number;
  getAvgBuyPrice: (coinId: string) => number;
  getAllCoinIds: () => string[];
  // Migration
  migrateOldPortfolio: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      favorites: [],
      portfolio: {},
      transactions: [],
      migrated: false,

      addFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites
            : [...state.favorites, id],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav !== id),
        })),

      // Legacy methods (kept for backward compatibility)
      updatePortfolio: (id, amount) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            [id]: { amount },
          },
        })),

      removePortfolioItem: (id) =>
        set((state) => {
          const newPortfolio = { ...state.portfolio };
          delete newPortfolio[id];
          return { portfolio: newPortfolio };
        }),

      // New transaction methods
      addTransaction: (transaction) =>
        set((state) => {
          const newTransaction: Transaction = {
            ...transaction,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          return {
            transactions: [...state.transactions, newTransaction].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
          };
        }),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions
            .map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      getTransactionsByCoin: (coinId) => {
        return get().transactions.filter((tx) => tx.coinId === coinId);
      },

      // Calculation helpers
      getHoldings: (coinId) => {
        const transactions = get().getTransactionsByCoin(coinId);
        return transactions.reduce((total, tx) => {
          if (tx.type === "buy" || tx.type === "transfer") {
            return total + tx.amountCrypto;
          } else if (tx.type === "sell") {
            return total - tx.amountCrypto;
          }
          return total;
        }, 0);
      },

      getCostBasis: (coinId) => {
        const transactions = get().getTransactionsByCoin(coinId);
        return transactions.reduce((total, tx) => {
          if (tx.type === "buy") {
            return total + tx.amountFiat + (tx.fee || 0);
          } else if (tx.type === "sell") {
            return total - tx.amountFiat + (tx.fee || 0);
          }
          return total;
        }, 0);
      },

      getAvgBuyPrice: (coinId) => {
        const holdings = get().getHoldings(coinId);
        const costBasis = get().getCostBasis(coinId);
        if (holdings <= 0) return 0;
        return costBasis / holdings;
      },

      getAllCoinIds: () => {
        const coinIds = new Set<string>();
        get().transactions.forEach((tx) => coinIds.add(tx.coinId));
        return Array.from(coinIds);
      },

      // Migration: Convert old portfolio amounts to buy transactions
      migrateOldPortfolio: () => {
        const state = get();
        if (state.migrated) return;

        const newTransactions: Transaction[] = [];
        Object.entries(state.portfolio).forEach(([coinId, item]) => {
          if (item.amount > 0) {
            newTransactions.push({
              id: `migrated-${coinId}-${Date.now()}`,
              coinId: coinId.toLowerCase(),
              type: "buy" as const,
              amountCrypto: item.amount,
              amountFiat: 0, // We don't have historical price data
              date: new Date().toISOString(),
              notes: "Migrated from old portfolio",
            });
          }
        });

        set({
          transactions: [...state.transactions, ...newTransactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
          migrated: true,
        });
      },
    }),
    {
      name: "crypto-tracker-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

import { View, Text, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Transaction } from "../../store/useStore";
import { Coin } from "../../lib/api";
import TransactionItem from "../TransactionItem";
import TransactionFilters from "./TransactionFilters";
import StatsCards from "./StatsCards";
import BannerAd from "../ads/BannerAd";

interface CoinStats {
  currentValue: number;
  profit24h: { profit: number; profitPercent: number };
  allTimeProfit: { profit: number; profitPercent: number };
  holdings: number;
  costBasis: number;
}

interface TransactionsTabProps {
  transactions: Transaction[];
  selectedCoin?: CoinStats & { id: string; name: string; symbol: string; image?: string };
  transactionTypeFilter: "all" | "buy" | "sell" | "transfer";
  selectedCoinId?: string;
  coinFilter: string;
  coins?: Coin[];
  onTypeFilterPress: () => void;
  onCoinFilterPress: () => void;
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionsTab({
  transactions,
  selectedCoin,
  transactionTypeFilter,
  selectedCoinId,
  coinFilter,
  coins,
  onTypeFilterPress,
  onCoinFilterPress,
  onDeleteTransaction,
}: TransactionsTabProps) {
  return (
    <View className="flex-1">
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <TransactionFilters
              transactionTypeFilter={transactionTypeFilter}
              selectedCoinId={selectedCoinId}
              selectedCoinName={selectedCoin?.name}
              coinFilter={coinFilter}
              allCoinsName={coins?.find((c) => c.id === coinFilter)?.name}
              onTypeFilterPress={onTypeFilterPress}
              onCoinFilterPress={onCoinFilterPress}
            />

            {selectedCoin && <StatsCards coin={selectedCoin} />}
          </>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8 mt-20">
            <AntDesign name={"filetext1" as any} size={48} color="#94A3B8" />
            <Text className="text-gray-400 text-center mt-4">
              {selectedCoinId
                ? "No transactions for this coin yet."
                : "No transactions yet. Add your first transaction to get started."}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const coin = coins?.find((c) => c.id === item.coinId);
          return (
            <TransactionItem
              transaction={item}
              coinName={coin?.name}
              coinSymbol={coin?.symbol}
              coinImage={coin?.image}
              onDelete={() => onDeleteTransaction(item.id)}
            />
          );
        }}
        ListFooterComponent={
          <View className="py-4">
            <BannerAd className="bg-surface" />
          </View>
        }
      />
    </View>
  );
}


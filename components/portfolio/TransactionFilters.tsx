import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface TransactionFiltersProps {
  transactionTypeFilter: "all" | "buy" | "sell" | "transfer";
  selectedCoinId?: string;
  selectedCoinName?: string;
  coinFilter: string;
  allCoinsName?: string;
  onTypeFilterPress: () => void;
  onCoinFilterPress: () => void;
}

export default function TransactionFilters({
  transactionTypeFilter,
  selectedCoinId,
  selectedCoinName,
  coinFilter,
  allCoinsName,
  onTypeFilterPress,
  onCoinFilterPress,
}: TransactionFiltersProps) {
  return (
    <View className="flex-row gap-2 p-4 border-b border-gray-800">
      <View className="flex-1" style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={onTypeFilterPress}
          className="bg-surface p-3 rounded-lg flex-row items-center justify-between"
        >
          <Text className="text-white text-sm flex-1" numberOfLines={1}>
            {transactionTypeFilter === "all"
              ? "All Types"
              : transactionTypeFilter.charAt(0).toUpperCase() +
                transactionTypeFilter.slice(1)}
          </Text>
          <AntDesign name="down" size={14} color="#94A3B8" />
        </TouchableOpacity>
      </View>
      <View className="flex-1" style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={onCoinFilterPress}
          className="bg-surface p-3 rounded-lg flex-row items-center justify-between"
        >
          <Text className="text-white text-sm flex-1" numberOfLines={1}>
            {selectedCoinId
              ? selectedCoinName || selectedCoinId
              : coinFilter === "all"
              ? "All Coins"
              : allCoinsName || coinFilter}
          </Text>
          <AntDesign name="down" size={14} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


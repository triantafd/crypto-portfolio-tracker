import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";

interface PortfolioSummaryProps {
  totalValue: number;
  portfolio24hChange: number;
  portfolio24hChangePercent: number;
  totalAllTimeProfit: { profit: number; profitPercent: number };
  hideBalance: boolean;
  onToggleHideBalance: () => void;
}

export default function PortfolioSummary({
  totalValue,
  portfolio24hChange,
  portfolio24hChangePercent,
  totalAllTimeProfit,
  hideBalance,
  onToggleHideBalance,
}: PortfolioSummaryProps) {
  return (
    <View className="p-4 bg-surface m-4 rounded-xl">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-400 text-sm">Total Balance</Text>
        <TouchableOpacity onPress={onToggleHideBalance}>
          <Ionicons
            name={hideBalance ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#94A3B8"
          />
        </TouchableOpacity>
      </View>
      <Text className="text-3xl font-bold text-white">
        {hideBalance ? "••••••" : `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
      </Text>

      <View className="flex-row items-center gap-4 mt-4">
        <View>
          <Text className="text-gray-400 text-xs">24h</Text>
          <Text
            className={clsx(
              "text-sm font-semibold",
              portfolio24hChange >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {portfolio24hChange >= 0 ? "+" : ""}
            ${portfolio24hChange.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
            {portfolio24hChange >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(portfolio24hChangePercent).toFixed(2)}%
          </Text>
        </View>
        <View>
          <Text className="text-gray-400 text-xs">All-Time</Text>
          <Text
            className={clsx(
              "text-sm font-semibold",
              totalAllTimeProfit.profit >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {totalAllTimeProfit.profit >= 0 ? "+" : ""}
            ${totalAllTimeProfit.profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
            {totalAllTimeProfit.profit >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(totalAllTimeProfit.profitPercent).toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
}


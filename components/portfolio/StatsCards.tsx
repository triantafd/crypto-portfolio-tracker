import { View, Text } from "react-native";
import clsx from "clsx";

interface CoinStats {
  currentValue: number;
  profit24h: { profit: number; profitPercent: number };
  allTimeProfit: { profit: number; profitPercent: number };
  holdings: number;
  costBasis: number;
}

interface StatsCardsProps {
  coin: CoinStats;
}

export default function StatsCards({ coin }: StatsCardsProps) {
  const avgBuyPrice = coin.holdings > 0 ? coin.costBasis / coin.holdings : 0;

  return (
    <View className="p-4">
      {/* 2x2 Grid Layout */}
      <View className="flex-row flex-wrap gap-3 mb-4">
        {/* Holdings */}
        <View className="bg-surface rounded-xl p-4 flex-1" style={{ minWidth: "47%" }}>
          <Text className="text-gray-400 text-sm mb-1">Holdings</Text>
          <Text className="text-white text-xl font-bold mb-1">
            ${coin.currentValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text
            className={clsx(
              "text-xs font-medium",
              coin.profit24h.profit >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {coin.profit24h.profit >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(coin.profit24h.profitPercent).toFixed(2)}% (24h)
          </Text>
        </View>

        {/* All-Time Profit */}
        <View className="bg-surface rounded-xl p-4 flex-1" style={{ minWidth: "47%" }}>
          <Text className="text-gray-400 text-sm mb-1">All-Time Profit</Text>
          <Text
            className={clsx(
              "text-xl font-bold mb-1",
              coin.allTimeProfit.profit >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {coin.allTimeProfit.profit >= 0 ? "+" : ""}
            $
            {coin.allTimeProfit.profit.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text
            className={clsx(
              "text-xs font-medium",
              coin.allTimeProfit.profit >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {coin.allTimeProfit.profit >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(coin.allTimeProfit.profitPercent).toFixed(2)}%
          </Text>
        </View>

        {/* Avg Buy Price */}
        <View className="bg-surface rounded-xl p-4 flex-1" style={{ minWidth: "47%" }}>
          <Text className="text-gray-400 text-sm mb-1">Avg. Buy Price</Text>
          <Text className="text-white text-xl font-bold">
            ${avgBuyPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Cost Basis */}
        <View className="bg-surface rounded-xl p-4 flex-1" style={{ minWidth: "47%" }}>
          <Text className="text-gray-400 text-sm mb-1">Cost Basis</Text>
          <Text className="text-white text-xl font-bold">
            ${coin.costBasis.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}


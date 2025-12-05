import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import clsx from "clsx";
import { Coin } from "../../lib/api";
import BannerAd from "../ads/BannerAd";

interface PortfolioCoin extends Coin {
  holdings: number;
  currentValue: number;
  profit24h: { profit: number; profitPercent: number };
}

interface OverviewTabProps {
  portfolioData: PortfolioCoin[];
  onCoinPress: (coinId: string) => void;
}

export default function OverviewTab({ portfolioData, onCoinPress }: OverviewTabProps) {
  return (
    <FlatList
      data={portfolioData}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center p-8 mt-20">
          <AntDesign name="wallet" size={48} color="#94A3B8" />
          <Text className="text-gray-400 text-center mt-4">
            No holdings yet. Add a transaction to get started.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        if (item.holdings <= 0) return null;

        return (
          <TouchableOpacity
            onPress={() => onCoinPress(item.id)}
            className="flex-row items-center justify-between p-4 border-b border-gray-800 bg-surface active:bg-gray-800"
          >
            <View className="flex-row items-center gap-3 flex-1">
              {item.image ? (
                <Image source={{ uri: item.image }} className="w-10 h-10 rounded-full" />
              ) : (
                <View className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center">
                  <Text className="text-white font-bold">
                    {item.symbol.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-white font-bold text-base">{item.name}</Text>
                <Text className="text-gray-400 text-sm">
                  {item.holdings.toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}{" "}
                  {item.symbol.toUpperCase()}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-white font-bold text-base">
                ${item.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </Text>
              <Text
                className={clsx(
                  "text-sm",
                  item.profit24h.profit >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {item.profit24h.profit >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(item.profit24h.profitPercent).toFixed(2)}% (24h)
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      ListFooterComponent={
        <View className="py-4">
          <BannerAd className="bg-surface" />
        </View>
      }
    />
  );
}


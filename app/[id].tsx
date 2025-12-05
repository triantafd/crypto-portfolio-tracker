import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getCoinDetails } from "../lib/api";
import Chart from "../components/Chart";
import { useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useStore } from "../store/useStore";
import clsx from "clsx";

const RANGES = ["1", "7", "30", "90", "365"];

export default function CoinDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [days, setDays] = useState("7");
  const { favorites, addFavorite, removeFavorite } = useStore();

  const isFavorite = favorites.includes(id);

  const { data: coin, isLoading } = useQuery({
    queryKey: ["coinDetails", id],
    queryFn: () => getCoinDetails(id),
    enabled: !!id,
  });

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  if (isLoading || !coin) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: coin.name,
          headerRight: () => (
            <TouchableOpacity onPress={toggleFavorite}>
              {isFavorite ? (
                <AntDesign name="star" size={24} color="#F59E0B" />
              ) : (
                <Ionicons name="star-outline" size={24} color="#94A3B8" />
              )}
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: '#1E293B' },
          headerTintColor: '#fff',
        }}
      />

      <View className="p-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <Image source={{ uri: coin.image.small }} className="w-12 h-12 rounded-full" />
            <View>
              <Text className="text-white text-2xl font-bold">{coin.name}</Text>
              <Text className="text-gray-400 text-lg uppercase">{coin.symbol}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-white text-2xl font-bold">
              ${coin.market_data.current_price.usd.toLocaleString()}
            </Text>
            <Text
              className={clsx(
                "text-lg font-medium",
                coin.market_data.price_change_percentage_24h > 0 ? "text-secondary" : "text-red-500"
              )}
            >
              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </Text>
          </View>
        </View>

        <Chart id={id} days={days} />

        <View className="flex-row justify-between bg-surface p-1 rounded-lg mb-6">
          {RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setDays(range)}
              className={clsx(
                "px-4 py-2 rounded-md",
                days === range ? "bg-gray-700" : "bg-transparent"
              )}
            >
              <Text className={clsx(
                "font-bold",
                days === range ? "text-white" : "text-gray-400"
              )}>
                {range}D
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="bg-surface rounded-xl p-4 gap-4">
          <Text className="text-white text-xl font-bold mb-2">Market Stats</Text>

          <View className="flex-row justify-between border-b border-gray-700 pb-2">
            <Text className="text-gray-400">Market Cap</Text>
            <Text className="text-white font-medium">
              ${coin.market_data.market_cap.usd.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between border-b border-gray-700 pb-2">
            <Text className="text-gray-400">24h High</Text>
            <Text className="text-white font-medium">
              ${coin.market_data.high_24h.usd.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between border-b border-gray-700 pb-2">
            <Text className="text-gray-400">24h Low</Text>
            <Text className="text-white font-medium">
              ${coin.market_data.low_24h.usd.toLocaleString()}
            </Text>
          </View>
        </View>

        {coin.description.en ? (
          <View className="mt-6 bg-surface rounded-xl p-4">
            <Text className="text-white text-xl font-bold mb-2">About</Text>
            <Text className="text-gray-300 leading-6">
              {coin.description.en.split(". ")[0]}.
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

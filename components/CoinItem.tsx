import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { Coin } from "../lib/api";
import { AntDesign, Feather } from "@expo/vector-icons";

interface CoinItemProps {
  coin: Coin;
}

export default function CoinItem({ coin }: CoinItemProps) {
  return (
    <Link href={`/${coin.id}`} asChild>
      <Pressable className="flex-row items-center justify-between p-4 border-b border-gray-800 bg-surface active:bg-gray-800">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: coin.image }}
            className="w-10 h-10 rounded-full"
          />
          <View>
            <Text className="text-white font-bold text-base">{coin.name}</Text>
            <Text className="text-gray-400 text-sm uppercase">{coin.symbol}</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-white font-bold text-base">
            ${coin.current_price.toLocaleString()}
          </Text>
          <View className="flex-row items-center gap-1">
            <Feather
              // @ts-ignore
              name={coin.price_change_percentage_24h > 0 ? "arrow-up" : "arrow-down"}
              size={12}
              color={coin.price_change_percentage_24h > 0 ? "#10B981" : "#EF4444"}
            />
            <Text
              className={`text-sm font-medium ${coin.price_change_percentage_24h > 0
                ? "text-secondary"
                : "text-red-500"
                }`}
            >
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

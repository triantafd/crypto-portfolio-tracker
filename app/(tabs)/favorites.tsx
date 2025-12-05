import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCoinsByIds } from "../../lib/api";
import CoinItem from "../../components/CoinItem";
import { useStore } from "../../store/useStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  const { data: coins, isLoading, error, refetch, isError } = useQuery({
    queryKey: ["favorites", favorites],
    queryFn: () => getCoinsByIds(favorites),
    enabled: favorites.length > 0,
    // Use cached data even when there's an error (react-query v5)
    placeholderData: (previousData) => previousData,
    // Don't retry on rate limit errors
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Show cached data even if there's an error
  const displayCoins = coins || [];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-gray-800">
        <Text className="text-2xl font-bold text-white">Favorites</Text>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">No favorites yet</Text>
        </View>
      ) : (
        <>
          {/* Show error message but still display cached data */}
          {isError && (
            <View className="bg-yellow-900/20 border-b border-yellow-800 px-4 py-3 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-yellow-400 text-sm font-medium">
                  Rate limit exceeded. Showing cached data.
                </Text>
              </View>
              <TouchableOpacity onPress={onRefresh}>
                <AntDesign name="reload" size={16} color="#FCD34D" />
              </TouchableOpacity>
            </View>
          )}

          {isLoading && !refreshing && displayCoins.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : (
            <FlatList
              data={displayCoins}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CoinItem coin={item} />}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center p-8 mt-20">
                  <AntDesign name="star" size={48} color="#94A3B8" />
                  <Text className="text-gray-400 text-center mt-4">
                    {isError 
                      ? "Unable to load favorites. Please try again later."
                      : "No favorites found."}
                  </Text>
                </View>
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
              }
            />
          )}
        </>
      )}
    </View>
  );
}

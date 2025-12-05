import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCoins } from "../../lib/api";
import CoinItem from "../../components/CoinItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import BannerAd from "../../components/ads/BannerAd";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["coins"],
    queryFn: ({ pageParam = 1 }) => getCoins(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const coins = data?.pages.flat() || [];

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-gray-800">
        <Text className="text-2xl font-bold text-white">Crypto Market</Text>
      </View>

      <FlatList
        data={coins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CoinItem coin={item} />}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
        }
        ListFooterComponent={
          <>
            {isFetchingNextPage && (
              <View className="py-4">
                <ActivityIndicator color="#3B82F6" />
              </View>
            )}
            <View className="py-4">
              <BannerAd className="bg-surface" />
            </View>
          </>
        }
      />
    </View>
  );
}

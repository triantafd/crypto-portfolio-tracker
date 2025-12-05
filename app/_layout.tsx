import "../global.css";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "../lib/queryClient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { initializeAds } from "../lib/ads";

export default function RootLayout() {
  const { migrateOldPortfolio, migrated } = useStore();

  // Initialize Google Mobile Ads
  useEffect(() => {
    initializeAds();
  }, []);

  // Migrate old portfolio data on app startup
  useEffect(() => {
    if (!migrated) {
      migrateOldPortfolio();
    }
  }, [migrated, migrateOldPortfolio]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="[id]"
              options={{
                presentation: 'card',
                headerShown: true,
                title: 'Coin Details',
                headerBackTitle: 'Back'
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

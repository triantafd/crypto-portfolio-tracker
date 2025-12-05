import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh longer
      gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache longer (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on rate limits
        if (error?.response?.status === 429) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false, // Don't refetch on window focus to save requests
      refetchOnReconnect: false, // Don't refetch on reconnect
      // Use cached data even when there's an error
      placeholderData: (previousData: any) => previousData,
    },
  },
});

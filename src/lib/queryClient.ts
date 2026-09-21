import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes.
      staleTime: 5 * 60 * 1000,

      // Keep unused query data in memory for 10 minutes.
      gcTime: 10 * 60 * 1000,

      // Retry failed requests 2 times.
      retry: 2,

      // Refetch when the user returns to the browser tab.
      refetchOnWindowFocus: true,

      // Refetch when the component mounts only if data is stale.
      refetchOnMount: true,

      // Don't automatically refetch just because the network reconnects.
      refetchOnReconnect: true,
    },
  },
});

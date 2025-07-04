import { QueryClient } from "@tanstack/react-query";

// Default query function
const defaultQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const [url] = queryKey;
  const response = await fetch(url as string, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 3,
      refetchOnWindowFocus: false,
      queryFn: defaultQueryFn,
    },
  },
});
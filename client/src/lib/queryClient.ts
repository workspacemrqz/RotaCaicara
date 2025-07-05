import { QueryClient } from "@tanstack/react-query";

// Create a fetch wrapper that includes proper error handling
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any
) {
  console.log(`🔵 Frontend API Request: ${method} ${url}`, data ? { data } : '');
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
    console.log('📤 Request body:', JSON.stringify(data, null, 2));
  }

  try {
    const response = await fetch(url, options);
    console.log(`📊 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ API Response for ${url}:`, result);
    
    // Validate response structure
    if (Array.isArray(result)) {
      console.log(`📊 Response array length: ${result.length}`);
    } else if (typeof result === 'object' && result !== null) {
      console.log(`📊 Response object keys:`, Object.keys(result));
    }
    
    return result;
  } catch (error) {
    console.error(`❌ API Request failed for ${url}:`, error);
    throw error;
  }
}

// Default query function
const defaultQueryFn = async ({ queryKey }: { queryKey: any[] }) => {
  const [url] = queryKey;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});
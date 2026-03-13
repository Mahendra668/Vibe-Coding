/**
 * API Service
 * Standardized API calls for the StudentHub application.
 */

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

const fetchApi = async <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const apiService = {
  get: <T>(url: string, token?: string) => 
    fetchApi<T>(url, {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    }),

  post: <T>(url: string, body: any, token?: string) => 
    fetchApi<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    }),
};

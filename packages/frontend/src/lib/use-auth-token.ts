'use client';

import { useAuth0 } from '@auth0/auth0-react';

/**
 * Hook to get the Auth0 access token for API calls to your backend.
 * Use getAuthHeaders() when making authenticated fetch requests.
 */
export function useAuthToken() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    if (!isAuthenticated) return {};
    try {
      const token = await getAccessTokenSilently();
      if (!token) return {};
      return { Authorization: `Bearer ${token}` };
    } catch (err) {
      console.warn('Auth token unavailable:', err);
      return {};
    }
  };

  return { getAuthHeaders, getAccessTokenSilently, isAuthenticated, isLoading };
}

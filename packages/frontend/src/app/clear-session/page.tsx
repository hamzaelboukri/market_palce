'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Clears Auth0 session and local cache. Visit /clear-session if you get
 * "Service not found" after removing the API audience.
 */
export default function ClearSessionPage() {
  const router = useRouter();
  const { logout, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin + '/login' } });
    } else {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Clearing session...</p>
    </div>
  );
}

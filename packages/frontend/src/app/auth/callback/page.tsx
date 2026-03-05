'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      setTimeout(() => router.push('/login'), 3000);
      return;
    }
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Authenticating...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">Processing authentication...</p>
            <p className="text-sm text-gray-500 mt-2">You will be redirected automatically...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Authentication Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">{error.message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Success!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">Authentication successful!</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  );
}

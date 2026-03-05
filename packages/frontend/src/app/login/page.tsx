'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Chrome } from 'lucide-react';

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => loginWithRedirect();
  const handleSignup = () => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  const handleGoogleLogin = () => loginWithRedirect();
  const handleGithubLogin = () => loginWithRedirect();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to ProSets</CardTitle>
          <CardDescription>
            Sign in to access the digital marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={handleGoogleLogin}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            
            <Button
              className="w-full"
              variant="outline"
              onClick={handleGithubLogin}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          
          <Button
            className="w-full"
            onClick={handleLogin}
          >
            Sign in with Email
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={handleSignup} className="text-blue-600 hover:underline">
              Sign up
            </button>
          </p>
          
          <div className="text-center text-xs text-gray-500 mt-4">
            Sign in with Google, GitHub, or email via Auth0
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

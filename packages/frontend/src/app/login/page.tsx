'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Chrome, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => loginWithRedirect();
  const handleSignup = () => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  const handleGoogleLogin = () => loginWithRedirect();
  const handleGithubLogin = () => loginWithRedirect();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            ProSets
          </Link>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access the digital marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              className="w-full h-11"
              variant="outline"
              onClick={handleGoogleLogin}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            
            <Button
              className="w-full h-11"
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
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          
          <Button
            className="w-full h-11"
            onClick={handleLogin}
          >
            <Mail className="mr-2 h-4 w-4" />
            Sign in with Email
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button onClick={handleSignup} className="text-primary font-medium hover:underline">
              Sign up
            </button>
          </p>
          
          <div className="text-center text-xs text-muted-foreground pt-2">
            Secure authentication via Auth0
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

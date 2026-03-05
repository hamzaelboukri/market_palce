'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, LogOut, ShoppingBag, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserProfile() {
  const { user, isLoading, isAuthenticated, logout } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!isAuthenticated || !user) return null;

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.06),transparent_50%)]" />
      <Navigation />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile header */}
        <Card className="mb-8 overflow-hidden border-border/80 bg-card/80 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                <AvatarImage src={user.picture} alt={user.name || ''} />
                <AvatarFallback className="bg-primary/15 text-primary text-2xl font-semibold">
                  {user.name?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{user.name || 'User'}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="group shrink-0 border-border/80 hover:bg-muted/50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Quick actions */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="group overflow-hidden border-border/80 bg-card/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Purchase History</CardTitle>
              <CardDescription>
                View and download your purchased digital assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-5 text-sm text-muted-foreground">
                You haven&apos;t made any purchases yet.
              </p>
              <Button asChild className="group/btn">
                <Link href="/dashboard/purchases" className="inline-flex items-center">
                  View Purchase History
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-border/80 bg-card/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Store className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">My Sales</CardTitle>
              <CardDescription>
                Manage your uploaded assets and track earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-5 text-sm text-muted-foreground">
                Start selling your digital assets.
              </p>
              <Button asChild className="group/btn">
                <Link href="/seller/dashboard" className="inline-flex items-center">
                  Go to Seller Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, LogOut, ShoppingBag, Sparkles, Store, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
  const { user, isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleLogin = () => loginWithRedirect();
  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/80 shadow-sm backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group inline-flex items-center gap-2 text-xl font-bold text-foreground">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="group-hover:text-primary transition-colors">ProSets</span>
            </Link>
            <div className="animate-pulse">
              <div className="h-9 w-24 bg-muted rounded-md" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/80 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="group inline-flex items-center gap-2 text-xl font-bold text-foreground">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="group-hover:text-primary transition-colors">ProSets</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/assets" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Browse Assets
              </Link>
              {user && isAuthenticated && (
                <Link href="/seller/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Sell
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 ring-2 ring-border">
                      <AvatarImage src={user.picture} alt={user.name || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.picture} alt={user.name || ''} />
                      <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      {user.name && <p className="font-medium truncate">{user.name}</p>}
                      {user.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/purchases" className="flex items-center cursor-pointer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Purchase History
                    </Link>
                  </DropdownMenuItem>
                  {(user as { role?: string }).role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/seller/dashboard" className="flex items-center cursor-pointer">
                      <Store className="mr-2 h-4 w-4" />
                      Seller Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleLogin} className="font-medium">
                  Sign In
                </Button>
                <Button onClick={handleLogin} className="shadow-sm">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

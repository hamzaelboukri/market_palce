'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthToken } from '@/lib/use-auth-token';
import {
    Plus,
    DollarSign,
    ShoppingBag,
    TrendingUp,
    Package,
    ExternalLink,
    Edit
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalPurchases: number;
    totalRevenue: number;
    averagePrice: number;
}

interface Asset {
    id: string;
    title: string;
    price: number;
    status: string;
    downloadsCount: number;
    createdAt: string;
}

export default function SellerDashboard() {
    const router = useRouter();
    const { getAuthHeaders, isAuthenticated, isLoading } = useAuthToken();
    const [stats, setStats] = useState<Stats | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push('/login');
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) fetchDashboardData();
    }, [isAuthenticated]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const headers = await getAuthHeaders();

            const [statsRes, assetsRes] = await Promise.all([
                fetch(`${API_URL}/purchases/stats`, { headers }),
                fetch(`${API_URL}/assets/my-assets`, { headers })
            ]);

            const statsData = statsRes.ok ? await statsRes.json() : null;
            const assetsData = assetsRes.ok ? await assetsRes.json() : [];

            setStats(statsData);
            setAssets(Array.isArray(assetsData) ? assetsData : []);
        } catch (error) {
            console.error('Failed to fetch seller data:', error);
            setAssets([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.06),transparent_50%)]" />
            <Navigation />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
                        <p className="text-muted-foreground">Manage your assets and track your earnings</p>
                    </div>
                    <Button asChild>
                        <Link href="/seller/assets/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Upload New Asset
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <Card className="overflow-hidden border-border/80 bg-card/80 shadow-sm backdrop-blur transition-all duration-200 hover:border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) ?? '0.00'}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Earnings from all sales</p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-border/80 bg-card/80 shadow-sm backdrop-blur transition-all duration-200 hover:border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalPurchases ?? 0}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Number of assets sold</p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-border/80 bg-card/80 shadow-sm backdrop-blur transition-all duration-200 hover:border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats?.averagePrice?.toFixed(2) ?? '0.00'}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Average sale value</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Assets List */}
                <Card className="overflow-hidden border-border/80 bg-card/80 shadow-sm backdrop-blur">
                    <CardHeader>
                        <CardTitle>My Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {assets.length === 0 ? (
                            <div className="flex flex-col items-center py-12 text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Package className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold">No assets yet</h3>
                                <p className="mb-6 max-w-sm text-muted-foreground">Start selling by uploading your first digital product</p>
                                <Button asChild>
                                    <Link href="/seller/assets/new">Upload Now</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border/80">
                                            <th className="pb-3 font-semibold">Asset</th>
                                            <th className="pb-3 font-semibold">Status</th>
                                            <th className="pb-3 font-semibold">Price</th>
                                            <th className="pb-3 font-semibold">Sales</th>
                                            <th className="pb-3 font-semibold">Created</th>
                                            <th className="pb-3 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/80">
                                        {assets.map((asset) => (
                                            <tr key={asset.id} className="transition-colors hover:bg-muted/50">
                                                <td className="py-4">
                                                    <div className="font-medium text-foreground">{asset.title}</div>
                                                    <div className="text-xs text-muted-foreground">ID: {asset.id.slice(0, 8)}…</div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${asset.status === 'ACTIVE' ? 'bg-primary/15 text-primary' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                        {asset.status}
                                                    </span>
                                                </td>
                                                <td className="py-4">${Number(asset.price).toFixed(2)}</td>
                                                <td className="py-4">{asset.downloadsCount}</td>
                                                <td className="py-4 text-sm text-muted-foreground">
                                                    {new Date(asset.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/assets/${asset.id}`}>
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/seller/assets/${asset.id}/edit`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

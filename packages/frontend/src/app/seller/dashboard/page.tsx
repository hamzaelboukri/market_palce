'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
                fetch('http://localhost:3001/purchases/stats', { headers }),
                fetch('http://localhost:3001/assets/my-assets', { headers })
            ]);

            const statsData = await statsRes.json();
            const assetsData = await assetsRes.json();

            setStats(statsData);
            setAssets(assetsData);
        } catch (error) {
            console.error('Failed to fetch seller data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                        <p className="text-gray-600">Manage your assets and track your earnings</p>
                    </div>
                    <Button asChild>
                        <Link href="/seller/assets/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload New Asset
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2)}</div>
                            <p className="text-xs text-gray-500 mt-1">Earnings from all sales</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalPurchases}</div>
                            <p className="text-xs text-gray-500 mt-1">Number of assets sold</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Average Price</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats?.averagePrice.toFixed(2)}</div>
                            <p className="text-xs text-gray-500 mt-1">Average sale value</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Assets List */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {assets.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No assets yet</h3>
                                <p className="text-gray-500 mb-6">Start selling by uploading your first digital product</p>
                                <Button asChild variant="outline">
                                    <Link href="/seller/assets/new">Upload Now</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-3 font-semibold">Asset</th>
                                            <th className="pb-3 font-semibold">Status</th>
                                            <th className="pb-3 font-semibold">Price</th>
                                            <th className="pb-3 font-semibold">Sales</th>
                                            <th className="pb-3 font-semibold">Created</th>
                                            <th className="pb-3 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {assets.map((asset) => (
                                            <tr key={asset.id} className="hover:bg-gray-50">
                                                <td className="py-4">
                                                    <div className="font-medium text-gray-900">{asset.title}</div>
                                                    <div className="text-xs text-gray-500">ID: {asset.id}</div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${asset.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {asset.status}
                                                    </span>
                                                </td>
                                                <td className="py-4">${Number(asset.price).toFixed(2)}</td>
                                                <td className="py-4">{asset.downloadsCount}</td>
                                                <td className="py-4 text-sm text-gray-500">
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

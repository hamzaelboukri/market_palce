'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthToken } from '@/lib/use-auth-token';
import {
    Shield,
    Search,
    CheckCircle,
    XCircle,
    Eye,
    AlertTriangle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Asset {
    id: string;
    title: string;
    status: string;
    price: number;
    seller: {
        name: string;
        email: string;
    };
    createdAt: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { getAuthHeaders, isAuthenticated, isLoading } = useAuthToken();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push('/login');
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) fetchAssets();
    }, [isAuthenticated]);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const headers = await getAuthHeaders();
            const response = await fetch('http://localhost:3001/assets?limit=100', {
                headers
            });
            const data = await response.json();
            setAssets(data.assets || []);
        } catch (error) {
            console.error('Failed to fetch assets for moderation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (assetId: string, status: string) => {
        try {
            const headers = await getAuthHeaders();
            await fetch(`http://localhost:3001/assets/${assetId}`, {
                method: 'PATCH',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status } : a));
        } catch (error) {
            console.error('Failed to update asset status:', error);
        }
    };

    const filteredAssets = assets.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.seller.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Shield className="h-8 w-8 text-blue-600" />
                            Admin Moderation
                        </h1>
                        <p className="text-gray-600">Review and moderate marketplace assets</p>
                    </div>
                </div>

                <Card className="mb-8">
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by asset title or seller name..."
                                className="pl-10"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Global Asset Catalog</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 font-semibold">Asset</th>
                                        <th className="pb-3 font-semibold">Seller</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold">Created</th>
                                        <th className="pb-3 font-semibold text-right">Moderation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredAssets.map((asset) => (
                                        <tr key={asset.id} className="hover:bg-gray-50">
                                            <td className="py-4">
                                                <div className="font-medium">{asset.title}</div>
                                                <div className="text-xs text-gray-500">${asset.price}</div>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-sm font-medium">{asset.seller.name}</div>
                                                <div className="text-xs text-gray-500">{asset.seller.email}</div>
                                            </td>
                                            <td className="py-4">
                                                <Badge variant={
                                                    asset.status === 'ACTIVE' ? 'default' :
                                                        asset.status === 'PENDING_REVIEW' ? 'secondary' : 'destructive'
                                                }>
                                                    {asset.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-sm text-gray-500">
                                                {new Date(asset.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild title="View Details">
                                                        <Link href={`/assets/${asset.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    {asset.status !== 'ACTIVE' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                            onClick={() => handleUpdateStatus(asset.id, 'ACTIVE')}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {asset.status !== 'INACTIVE' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                            onClick={() => handleUpdateStatus(asset.id, 'INACTIVE')}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredAssets.length === 0 && (
                                <div className="text-center py-12">
                                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                                    <p className="text-gray-500">No assets found matching your search</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

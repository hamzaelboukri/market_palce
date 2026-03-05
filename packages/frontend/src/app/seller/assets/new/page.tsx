'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { useAuthToken } from '@/lib/use-auth-token';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NewAssetPage() {
    const router = useRouter();
    const { getAuthHeaders, isAuthenticated, isLoading } = useAuthToken();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push('/login');
    }, [isLoading, isAuthenticated, router]);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<{
        preview: boolean;
        source: boolean;
        db: boolean;
    }>({ preview: false, source: false, db: false });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: '',
    });

    const [files, setFiles] = useState<{
        preview: File | null;
        source: File | null;
    }>({ preview: null, source: null });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!files.preview || !files.source) {
            setError('Please select both a preview image and a source file.');
            setLoading(false);
            return;
        }

        try {
            const authHeaders = await getAuthHeaders();

            // 1. Generate a temporary ID for file keying
            const tempId = crypto.randomUUID();

            // 2. Upload Preview Media
            setUploadProgress(prev => ({ ...prev, preview: true }));
            const previewFormData = new FormData();
            previewFormData.append('file', files.preview);
            previewFormData.append('assetId', tempId);

            const previewRes = await fetch(`${API_URL}/s3/upload-preview`, {
                method: 'POST',
                headers: authHeaders,
                body: previewFormData,
            });
            const previewData = await previewRes.json();
            if (!previewRes.ok) throw new Error(previewData.message || 'Failed to upload preview');

            // 3. Upload Source File
            setUploadProgress(prev => ({ ...prev, source: true }));
            const sourceFormData = new FormData();
            sourceFormData.append('file', files.source);
            sourceFormData.append('assetId', tempId);

            const sourceRes = await fetch(`${API_URL}/s3/upload-source`, {
                method: 'POST',
                headers: authHeaders,
                body: sourceFormData,
            });
            const sourceData = await sourceRes.json();
            if (!sourceRes.ok) throw new Error(sourceData.message || 'Failed to upload source file');

            // 4. Create Asset record
            setUploadProgress(prev => ({ ...prev, db: true }));
            const assetPayload = {
                id: tempId,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                tags: formData.tags.split(',').map(tag => tag.trim()),
                previewImageUrl: previewData.url,
                sourceFileUrl: sourceData.key,
                sourceFileName: sourceData.fileName,
                sourceFileSize: sourceData.fileSize,
            };

            const assetRes = await fetch(`${API_URL}/assets`, {
                method: 'POST',
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assetPayload),
            });

            if (!assetRes.ok) {
                const assetData = await assetRes.json();
                throw new Error(assetData.message || 'Failed to create asset record');
            }

            router.push('/seller/dashboard');
        } catch (err: any) {
            setError(err.message);
            setUploadProgress({ preview: false, source: false, db: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="max-w-3xl mx-auto p-8">
            <div>
                <h1 className="text-3xl font-bold mb-8">Upload New Asset</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Asset Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    required
                                    placeholder="e.g. Modern Sofa 3D Model"
                                    value={formData.title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    required
                                    placeholder="Describe your asset in detail..."
                                    className="h-32"
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (USD)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MODEL_3D">3D Model</SelectItem>
                                            <SelectItem value="CODE_SNIPPET">Code Snippet</SelectItem>
                                            <SelectItem value="NOTION_TEMPLATE">Notion Template</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input
                                    id="tags"
                                    placeholder="3d, interior, furniture"
                                    value={formData.tags}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Files</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="preview">Preview Image (Publicly visible)</Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                                    <Input
                                        id="preview"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(prev => ({ ...prev, preview: e.target.files?.[0] || null }))}
                                    />
                                    <Label htmlFor="preview" className="cursor-pointer">
                                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-blue-600">Click to upload</span>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or WebP up to 5MB</p>
                                    </Label>
                                    {files.preview && (
                                        <p className="mt-2 text-sm text-green-600 font-medium">{files.preview.name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="source">Source File (Private, only for buyers)</Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                                    <Input
                                        id="source"
                                        type="file"
                                        className="hidden"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(prev => ({ ...prev, source: e.target.files?.[0] || null }))}
                                    />
                                    <Label htmlFor="source" className="cursor-pointer">
                                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-blue-600">Click to upload</span>
                                        <p className="text-xs text-gray-500 mt-1">ZIP, PDF or source file up to 50MB</p>
                                    </Label>
                                    {files.source && (
                                        <p className="mt-2 text-sm text-green-600 font-medium">{files.source.name}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading && (
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4 space-y-3">
                                <h3 className="font-semibold text-blue-900">Uploading in progress...</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        {uploadProgress.preview ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                        <span>Uploading preview image</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {uploadProgress.source ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="h-4 w-4" />}
                                        <span>Uploading source file</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {uploadProgress.db ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="h-4 w-4" />}
                                        <span>Saving asset details</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => router.back()} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating Asset...' : 'Upload & Sell'}
                        </Button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}

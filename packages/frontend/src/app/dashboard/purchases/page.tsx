'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { API_URL } from '@/lib/api'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useAuthToken } from '@/lib/use-auth-token'

interface Purchase {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
  asset: {
    id: string
    title: string
    price: number
    previewImageUrl?: string
  }
  downloadUrl?: string
  downloadExpires?: string
}

export default function PurchasesPage() {
  const router = useRouter()
  const { getAuthHeaders, isAuthenticated, isLoading } = useAuthToken()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login')
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) fetchPurchases()
  }, [isAuthenticated])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const authHeaders = await getAuthHeaders()
      const response = await fetch(`${API_URL}/purchases/my-purchases`, {
        headers: authHeaders
      })
      const data = response.ok ? await response.json() : []
      setPurchases(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (purchase: Purchase) => {
    if (purchase.downloadUrl && purchase.downloadExpires) {
      const expiresAt = new Date(purchase.downloadExpires)
      if (expiresAt > new Date()) {
        window.open(purchase.downloadUrl, '_blank')
        return
      }
    }

    // Generate new download URL
    try {
      const authHeaders = await getAuthHeaders()
      const response = await fetch(`${API_URL}/s3/download/${purchase.asset.id}`, {
        headers: authHeaders
      })
      const data = await response.json()
      
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank')
        // Update purchase with new download info
        setPurchases(prev => 
          prev.map(p => 
            p.id === purchase.id 
              ? { ...p, downloadUrl: data.downloadUrl, downloadExpires: new Date(Date.now() + 5 * 60 * 1000).toISOString() }
              : p
          )
        )
      }
    } catch (error) {
      console.error('Failed to generate download link:', error)
    }
  }

  const isDownloadExpired = (purchase: Purchase) => {
    if (!purchase.downloadExpires) return true
    return new Date(purchase.downloadExpires) <= new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your purchases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.06),transparent_50%)]" />
      <Navigation />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Purchases</h1>
          <p className="text-muted-foreground">
            View and download your purchased digital assets
          </p>
        </div>

        {purchases.length === 0 ? (
          <Card className="overflow-hidden border-border/80 bg-card/80 shadow-sm backdrop-blur">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Start exploring our marketplace to find amazing digital assets
              </p>
              <Button asChild>
                <Link href="/assets">
                  Browse Assets
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="overflow-hidden border-border/80 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {purchase.asset.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(purchase.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={purchase.status === 'PAID' ? 'default' : 'secondary'}>
                      {purchase.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {purchase.asset.previewImageUrl && (
                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden relative">
                      <Image 
                        src={purchase.asset.previewImageUrl} 
                        alt={purchase.asset.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ${purchase.amount}
                    </span>
                    <span className="text-sm text-gray-500">
                      {purchase.currency}
                    </span>
                  </div>

                  {purchase.status === 'PAID' ? (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleDownload(purchase)}
                        className="w-full"
                        variant={isDownloadExpired(purchase) ? "outline" : "default"}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloadExpired(purchase) ? 'Get New Download Link' : 'Download'}
                      </Button>
                      
                      {isDownloadExpired(purchase) && (
                        <p className="text-xs text-amber-600 text-center">
                          Download link expired. Generate a new one to download.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Payment processing...
                      </p>
                    </div>
                  )}

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/assets/${purchase.asset.id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Asset
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

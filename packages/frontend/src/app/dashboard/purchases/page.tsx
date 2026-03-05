'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
      const response = await fetch('http://localhost:3001/purchases/my-purchases', {
        headers: authHeaders
      })
      const data = await response.json()
      setPurchases(data)
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
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
      const response = await fetch(`http://localhost:3001/s3/download/${purchase.asset.id}`, {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Purchases</h1>
          <p className="text-gray-600">
            View and download your purchased digital assets
          </p>
        </div>

        {purchases.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Download className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
              <p className="text-gray-600 mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {purchase.asset.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
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
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={purchase.asset.previewImageUrl} 
                        alt={purchase.asset.title}
                        className="w-full h-full object-cover"
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
                        <p className="text-xs text-yellow-600 text-center">
                          Download link expired. Generate a new one to download.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">
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

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { API_URL } from '@/lib/api'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Download, ShoppingCart, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useAuthToken } from '@/lib/use-auth-token'

interface Asset {
  id: string
  title: string
  description: string
  price: number
  category: string
  previewImageUrl?: string
  previewVideoUrl?: string
  rating?: number
  downloadsCount: number
  seller: {
    id: string
    name: string
    email: string
  }
  reviews?: Array<{
    id: string
    rating: number
    comment: string
    user: {
      name: string
    }
    createdAt: string
  }>
  _count?: {
    purchases: number
    reviews: number
  }
}

export default function AssetDetailPage() {
  const params = useParams()
  const { getAuthHeaders } = useAuthToken()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchAsset(params.id as string)
    }
  }, [params.id])

  const fetchAsset = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/assets/${id}`)
      const data = await response.json()
      setAsset(data)
    } catch (error) {
      console.error('Failed to fetch asset:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!asset) return
    
    try {
      setPurchasing(true)
      const authHeaders = await getAuthHeaders()
      const response = await fetch(`${API_URL}/stripe/create-checkout-session/${asset.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      })
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error)
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">Asset Not Found</h1>
          <Button asChild>
            <Link href="/assets">Back to Assets</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 rounded-lg relative">
                  {asset.previewVideoUrl ? (
                    <video 
                      src={asset.previewVideoUrl} 
                      controls
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : asset.previewImageUrl ? (
                    <Image 
                      src={asset.previewImageUrl} 
                      alt={asset.title}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Preview Available
                    </div>
                  )}
                  <Badge className="absolute top-4 right-4">
                    {asset.category.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{asset.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{asset.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{asset.seller.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Added {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{asset.rating || 'N/A'}</span>
                    {asset._count?.reviews && (
                      <span className="text-xs">({asset._count.reviews} reviews)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{asset.downloadsCount} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    <span>{asset._count?.purchases || 0} purchases</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {asset.reviews && asset.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {asset.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.user.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-green-600">
                    ${asset.price}
                  </div>
                  <Button 
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full"
                    size="lg"
                  >
                    {purchasing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Buy Now
                      </div>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Secure payment via Stripe
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                  <h3 className="font-semibold">{asset.seller.name}</h3>
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

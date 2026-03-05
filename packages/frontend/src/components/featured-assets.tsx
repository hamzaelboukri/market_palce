'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Download, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { API_URL } from '@/lib/api'

interface Asset {
  id: string
  title: string
  description: string
  price: number
  category: string
  previewImageUrl?: string
  rating?: number
  downloadsCount: number
  seller: {
    name: string
  }
}

const categoryLabels: Record<string, string> = {
  MODEL_3D: '3D Model',
  CODE_SNIPPET: 'Code',
  NOTION_TEMPLATE: 'Notion',
  OTHER: 'Other'
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2
})

export function FeaturedAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/assets/featured`)
        const data = await response.json()
        setAssets(data)
      } catch (error) {
        console.error('Failed to fetch featured assets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (loading) {
    return (
      <section className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">Featured assets</h2>
              <p className="text-muted-foreground">Handpicked premium assets from top creators</p>
            </div>
            <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-5">
                  <div className="mb-3 h-5 rounded bg-muted" />
                  <div className="mb-2 h-3 rounded bg-muted" />
                  <div className="mb-4 h-3 w-4/5 rounded bg-muted" />
                  <div className="h-10 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">Featured assets</h2>
            <p className="text-muted-foreground">Handpicked premium assets from our creators</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/assets" className="group">
              View all assets
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {assets.length === 0 && (
          <Card className="border-dashed bg-card/80">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-lg font-medium">No featured assets yet</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Once creators publish highlighted items, they will show up here automatically.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <Card key={asset.id} className="group overflow-hidden border-border/80 bg-card/70 transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {asset.previewImageUrl ? (
                    <Image
                      src={asset.previewImageUrl}
                      alt={asset.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : <div className="flex h-full w-full items-center justify-center text-muted-foreground">No preview</div>}
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-background/90 text-foreground hover:bg-background/90">
                      {categoryLabels[asset.category] || asset.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <CardTitle className="mb-2 line-clamp-1 text-lg transition-colors group-hover:text-primary">{asset.title}</CardTitle>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{asset.description}</p>
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{asset.rating ? asset.rating.toFixed(1) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{asset.downloadsCount}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">by {asset.seller.name}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-5 pt-0">
                <span className="text-2xl font-bold text-primary">{priceFormatter.format(asset.price)}</span>
                <Button size="sm" asChild className="group">
                  <Link href={`/assets/${asset.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

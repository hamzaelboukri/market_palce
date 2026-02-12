import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Download } from 'lucide-react'

const featuredAssets = [
  {
    id: '1',
    title: 'Modern House 3D Model',
    description: 'High-quality architectural 3D model with textures',
    price: 29.99,
    category: 'MODEL_3D',
    previewImage: '/api/placeholder/300/200',
    rating: 4.8,
    downloads: 234,
    seller: 'ArchitectPro'
  },
  {
    id: '2',
    title: 'React Dashboard Component',
    description: 'Responsive dashboard component with charts',
    price: 19.99,
    category: 'CODE_SNIPPET',
    previewImage: '/api/placeholder/300/200',
    rating: 4.9,
    downloads: 567,
    seller: 'CodeMaster'
  },
  {
    id: '3',
    title: 'Project Management Template',
    description: 'Complete Notion template for project management',
    price: 14.99,
    category: 'NOTION_TEMPLATE',
    previewImage: '/api/placeholder/300/200',
    rating: 4.7,
    downloads: 123,
    seller: 'ProductivityGuru'
  }
]

export function FeaturedAssets() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src={asset.previewImage} 
                    alt={asset.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{asset.title}</CardTitle>
                <p className="text-sm text-gray-600 mb-3">{asset.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{asset.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{asset.downloads}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">by {asset.seller}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">${asset.price}</span>
                <Button size="sm">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

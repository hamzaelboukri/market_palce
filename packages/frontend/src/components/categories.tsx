import { Card, CardContent } from '@/components/ui/card'
import { Model3d, Code, FileText, Package } from 'lucide-react'

const categories = [
  {
    name: '3D Models',
    icon: Model3d,
    description: 'High-quality 3D models for games and visualization',
    count: 150
  },
  {
    name: 'Code Snippets',
    icon: Code,
    description: 'Reusable code components and utilities',
    count: 89
  },
  {
    name: 'Notion Templates',
    icon: FileText,
    description: 'Productivity templates for Notion',
    count: 67
  },
  {
    name: 'Other Assets',
    icon: Package,
    description: 'Various digital assets and resources',
    count: 23
  }
]

export function Categories() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <p className="text-xs text-gray-500">{category.count} items</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

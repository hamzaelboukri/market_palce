import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, Box, Code, FileText, Package } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: '3D Models',
    icon: Box,
    description: 'High-quality 3D models for games and visualization',
    count: 150,
    value: 'MODEL_3D'
  },
  {
    name: 'Code Snippets',
    icon: Code,
    description: 'Reusable code components and utilities',
    count: 89,
    value: 'CODE_SNIPPET'
  },
  {
    name: 'Notion Templates',
    icon: FileText,
    description: 'Productivity templates for Notion',
    count: 67,
    value: 'NOTION_TEMPLATE'
  },
  {
    name: 'Other Assets',
    icon: Package,
    description: 'Various digital assets and resources',
    count: 23,
    value: 'OTHER'
  }
]

export function Categories() {
  return (
    <section className="relative px-4 py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,hsl(var(--secondary)/0.45),transparent)]" />
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Browse by category</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Find exactly what you need across our curated collection of digital assets
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link href={`/assets?category=${category.value}`} key={category.name}>
                <Card className="group h-full cursor-pointer overflow-hidden border-border/80 bg-card/70 transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {category.count} items
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{category.name}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
                    <div className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Explore
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

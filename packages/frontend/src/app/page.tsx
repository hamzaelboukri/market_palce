import { Hero } from '@/components/hero'
import { FeaturedAssets } from '@/components/featured-assets'
import { Categories } from '@/components/categories'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedAssets />
    </main>
  )
}

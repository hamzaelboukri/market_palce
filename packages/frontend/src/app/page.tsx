import Navigation from '@/components/Navigation'
import { Hero } from '@/components/hero'
import { FeaturedAssets } from '@/components/featured-assets'
import { Categories } from '@/components/categories'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Categories />
      <FeaturedAssets />
    </main>
  )
}

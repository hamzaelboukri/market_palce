import Navigation from '@/components/Navigation'
import { Hero } from '@/components/hero'
import { FeaturedAssets } from '@/components/featured-assets'
import { Categories } from '@/components/categories'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_50%)]" />
      <Navigation />
      <Hero />
      <Categories />
      <FeaturedAssets />
      <Footer />
    </main>
  )
}

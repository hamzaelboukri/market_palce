import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Digital Assets
          <span className="text-blue-600"> Marketplace</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover premium 3D models, code snippets, and Notion templates. 
          Buy with confidence, download instantly after payment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/assets">
              Browse Assets
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/sell">
              Start Selling
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

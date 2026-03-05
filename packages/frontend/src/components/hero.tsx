import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Active creators', value: '1.2k+' },
  { label: 'Assets sold', value: '35k+' },
  { label: 'Average rating', value: '4.8/5' },
]

const trustPoints = [
  'Instant access after purchase',
  'Protected payments with Stripe',
  'Curated assets from verified creators',
]

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 md:pb-24 md:pt-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_55%)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Premium digital marketplace for creators
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Launch projects faster with
            <span className="block bg-gradient-to-r from-primary via-primary to-emerald-400 bg-clip-text text-transparent">
              high-quality digital assets
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
            Discover curated 3D models, code snippets, and Notion templates.
            Purchase in seconds and download instantly after payment.
          </p>

          <div className="mb-10 flex flex-col gap-4 sm:flex-row lg:justify-start">
            <Button asChild size="lg" className="h-12 px-8 text-base group">
              <Link href="/assets" className="flex items-center gap-2">
                Browse Assets
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 border-2 px-8 text-base hover:bg-primary/5"
            >
              <Link href="/seller/dashboard">Start Selling</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/70 bg-card/70 px-4 py-3 text-left backdrop-blur"
              >
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 -top-4 hidden rounded-lg border bg-background/80 px-3 py-2 shadow-sm backdrop-blur md:flex md:items-center md:gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">New assets every day</span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl backdrop-blur">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Buyer confidence guaranteed
            </div>
            <h3 className="mb-4 text-xl font-semibold">Why creators and buyers choose ProSets</h3>
            <ul className="space-y-3">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
              Start by exploring featured assets, then build your own creator store when you are ready.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

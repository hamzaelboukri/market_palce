import Link from 'next/link'
import { CreditCard, Lock, ShieldCheck } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative border-t border-border/70 bg-background/95">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-foreground transition-colors hover:text-primary">
              ProSets
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Your trusted marketplace for premium digital assets. 3D models, code snippets, and Notion templates.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Trusted creators
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background px-3 py-1 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" />
                Secure downloads
              </span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/assets" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Browse Assets
                </Link>
              </li>
              <li>
                <Link href="/assets?category=MODEL_3D" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  3D Models
                </Link>
              </li>
              <li>
                <Link href="/assets?category=CODE_SNIPPET" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Code Snippets
                </Link>
              </li>
              <li>
                <Link href="/assets?category=NOTION_TEMPLATE" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Notion Templates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Sell</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/seller/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/seller/assets/new" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Upload Asset
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProSets. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Secure payments via Stripe</span>
            <span className="opacity-50">•</span>
            <span>Auth0 powered</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

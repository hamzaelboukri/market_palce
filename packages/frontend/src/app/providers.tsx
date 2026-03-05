'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Auth0Provider } from '@auth0/auth0-react'
import { useState } from 'react'

const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''
const auth0ClientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''
const appOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const redirectUri = `${appOrigin}/auth/callback`

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      cacheLocation="memory"
      authorizationParams={{ redirect_uri: redirectUri }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Auth0Provider>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Download } from 'lucide-react'
import { useAuthToken } from '@/lib/use-auth-token'

export default function PurchasePage() {
  const params = useParams()
  const router = useRouter()
  const { getAuthHeaders } = useAuthToken()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if purchase was successful
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session_id')
    const success = urlParams.get('success') === 'true'

    if (sessionId && success) {
      setSuccess(true)
      setLoading(false)
    } else if (sessionId && !success) {
      setError('Payment was cancelled or failed')
      setLoading(false)
    } else {
      // Redirect to asset page if no session info
      router.push(`/assets/${params.id}`)
    }
  }, [params.id, router])

  const handleDownload = async () => {
    try {
      const authHeaders = await getAuthHeaders()
      const response = await fetch(`http://localhost:3001/s3/download/${params.id}`, {
        headers: authHeaders
      })
      const data = await response.json()
      
      if (data.downloadUrl) {
        window.location.href = data.downloadUrl
      } else {
        setError('Failed to generate download link')
      }
    } catch (error) {
      setError('Failed to generate download link')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Processing your purchase...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Purchase Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={() => router.back()}>
                Go Back
              </Button>
              <Button className="w-full" onClick={() => router.push('/assets')}>
                Browse Assets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Purchase Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Thank you for your purchase! Your digital asset is now ready for download.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Important:</strong> Your download link will expire in 5 minutes.
              Please download your file immediately.
            </p>
            <Button 
              onClick={handleDownload}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Now
            </Button>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => router.push('/purchases')}>
              View My Purchases
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/assets')}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

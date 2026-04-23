'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-zinc-100">Something went wrong!</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={() => reset()} variant="primary" size="lg">
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
      
      {error.digest && (
        <p className="text-xs text-zinc-600 font-mono">Error ID: {error.digest}</p>
      )}
    </div>
  )
}

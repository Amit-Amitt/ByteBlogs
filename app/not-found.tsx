import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
      <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
        <FileQuestion className="w-10 h-10 text-zinc-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-zinc-100">Page Not Found</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          The article or page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link href="/">
        <Button variant="primary" size="lg">
          <Home className="w-4 h-4 mr-2" />
          Back to Homepage
        </Button>
      </Link>
    </div>
  )
}

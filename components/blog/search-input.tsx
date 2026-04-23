'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { Search as SearchIcon } from 'lucide-react'

export default function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('search') || ''
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      router.push(`/search?search=${debouncedQuery}`)
    } else if (query === '') {
      router.push('/search')
    }
  }, [debouncedQuery, router])

  return (
    <div className="relative max-w-2xl mx-auto">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
      <Input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for articles, topics, or authors..."
        className="pl-12 h-14 bg-zinc-900/50 border-zinc-800 focus:border-indigo-500/50 text-lg rounded-2xl shadow-xl"
      />
    </div>
  )
}

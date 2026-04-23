import { getPosts } from '@/actions/posts'
import PostCard from '@/components/blog/post-card'
import SearchInput from '@/components/blog/search-input'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search = '' } = await searchParams
  const { data: posts } = search ? await getPosts(1, 20, search) : { data: [] }

  return (
    <div className="space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Explore Content</h1>
        <p className="text-zinc-400">Search through our library of AI-enhanced articles.</p>
      </div>

      <Suspense fallback={<Skeleton className="h-14 w-full max-w-2xl mx-auto rounded-2xl" />}>
        <SearchInput />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts && posts.map((post) => (
          <PostCard key={post.id} post={post as any} />
        ))}
      </div>

      {search && posts?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-lg">No matches found for "{search}". Try different keywords.</p>
        </div>
      )}

      {!search && (
        <div className="text-center py-20 opacity-50">
          <p className="text-zinc-500">Start typing to search...</p>
        </div>
      )}
    </div>
  )
}

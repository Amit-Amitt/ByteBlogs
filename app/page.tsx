import { getPosts } from '@/actions/posts'
import PostCard from '@/components/blog/post-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { page = '1', search = '' } = await searchParams
  const currentPage = parseInt(page)
  const limit = 9

  const { data: posts, count } = await getPosts(currentPage, limit, search)
  const totalPages = count ? Math.ceil(count / limit) : 0

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden rounded-3xl bg-secondary/50 border border-border">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary border border-border text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Content Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Design your <span className="gradient-text">Future</span> with ByteBlogs.
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Discover the latest in tech, design, and culture. Written by experts, enhanced by AI, and delivered with style.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="px-10">Get Started</Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg" className="px-10">Explore Posts</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground">Latest Articles</h2>
          {search && (
            <p className="text-sm text-muted-foreground">
              Showing results for "<span className="text-foreground">{search}</span>"
            </p>
          )}
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl border border-border">
            <p className="text-muted-foreground">No posts found. Be the first to write one!</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 pt-8">
            <Link href={`/?page=${currentPage - 1}${search ? `&search=${search}` : ''}`} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}>
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <span className="text-sm font-medium text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Link href={`/?page=${currentPage + 1}${search ? `&search=${search}` : ''}`} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

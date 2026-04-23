import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/auth'
import { getComments } from '@/actions/comments'
import { deletePost } from '@/actions/posts'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import CommentSection from '@/components/blog/comment-section'
import { Trash2, Edit, Calendar, BrainCircuit } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import SaveButton from '@/components/blog/save-button'
import { checkIfSaved } from '@/actions/profile'

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const profile = await getProfile()

  const { data: post, error } = await supabase
    .from('posts')
    .select('*, author:profiles(*)')
    .eq('slug', slug)
    .single()

  if (error || !post) {
    notFound()
  }

  const comments = await getComments(post.id)
  const isAuthor = profile?.id === post.author_id
  const isAdmin = profile?.role === 'admin'
  const isSaved = await checkIfSaved(post.id)

  return (
    <article className="max-w-4xl mx-auto py-12 space-y-12">
      {/* Header */}
      <header className="space-y-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-primary font-medium">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(post.created_at)}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">{post.title}</h1>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold">
              {post.author?.name?.charAt(0) || 'A'}
            </div>
            <span className="text-sm font-medium text-foreground/80">{post.author?.name || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <SaveButton postId={post.id} initiallySaved={isSaved} />
            {(isAuthor || isAdmin) && (
              <div className="flex items-center space-x-2">
                <Link href={`/posts/${post.slug}/edit`}>
                  <Button variant="outline" size="sm" className="h-9">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <form action={deletePost.bind(null, post.id)}>
                  <Button variant="danger" size="sm" className="h-9">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {post.image_url && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-2xl">
          <Image 
            src={post.image_url} 
            alt={post.title} 
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* AI Summary Section */}
      {post.summary && (
        <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BrainCircuit className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <BrainCircuit className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">AI Generated Summary</span>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed italic">
              &ldquo;{post.summary}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="prose dark:prose-invert prose-indigo max-w-none">
        {post.body.split('\n').map((para: string, i: number) => (
          para ? <p key={i} className="text-foreground/90 text-lg leading-relaxed mb-6">{para}</p> : <br key={i} />
        ))}
      </div>

      {/* Comments */}
      <CommentSection 
        postId={post.id} 
        initialComments={comments} 
        userProfile={profile} 
      />
    </article>
  )
}

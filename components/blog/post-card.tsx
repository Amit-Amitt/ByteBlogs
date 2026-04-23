import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import { ArrowRight, User } from 'lucide-react'

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="group relative flex flex-col space-y-4 rounded-2xl glass border border-border p-5 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
      {post.image_url && (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
          <Image 
            src={post.image_url} 
            alt={post.title} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center space-x-2 text-xs text-zinc-500">
          <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md font-medium">Article</span>
          <span>•</span>
          <span>{formatDate(post.created_at)}</span>
        </div>
        
        <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
          <Link href={`/posts/${post.slug}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>
        
        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {post.summary || post.body.substring(0, 150) + '...'}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <User className="w-3 h-3 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground/80">{post.author?.name || 'Anonymous'}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  )
}

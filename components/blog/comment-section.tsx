'use client'

import { useState, useOptimistic, useTransition, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addComment } from '@/actions/comments'
import { toast } from 'sonner'
import { Send, Loader2, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Comment, Profile } from '@/types'
import CommentItem from './comment-item'

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
  userProfile: Profile | null
}

export default function CommentSection({ postId, initialComments, userProfile }: CommentSectionProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  
  // Use optimistic comments for a snappy UI
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: Comment) => [...state, newComment]
  )

  // Build the comment tree
  const commentTree = useMemo(() => {
    const map = new Map<string, Comment & { replies: Comment[] }>()
    const roots: (Comment & { replies: Comment[] })[] = []

    optimisticComments.forEach(comment => {
      map.set(comment.id, { ...comment, replies: [] })
    })

    optimisticComments.forEach(comment => {
      const node = map.get(comment.id)!
      if (comment.parent_id && map.has(comment.parent_id)) {
        map.get(comment.parent_id)!.replies.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }, [optimisticComments])

  const isAdmin = userProfile?.role === 'admin'

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    const newComment: Comment = {
      id: Math.random().toString(),
      post_id: postId,
      user_id: userProfile?.id || '',
      content,
      created_at: new Date().toISOString(),
      user: userProfile || undefined
    }

    setContent('')
    
    startTransition(async () => {
      addOptimisticComment(newComment)
      const result = await addComment(postId, content)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Comment added')
      }
    })
  }

  return (
    <div className="space-y-12 pt-16 border-t border-border/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Discussion ({optimisticComments.length})</h3>
        </div>
      </div>

      {userProfile ? (
        <form onSubmit={handleAddComment} className="space-y-4 p-6 rounded-3xl bg-secondary/30 border border-border/50 group focus-within:border-primary/30 transition-colors">
          <Textarea 
            placeholder="What are your thoughts on this?" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
            className="bg-transparent border-none focus-visible:ring-0 min-h-[100px] resize-none text-lg p-0"
          />
          <div className="flex justify-end pt-4 border-t border-border/30">
            <Button type="submit" disabled={isPending || !content.trim()} className="rounded-xl px-6">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-8 rounded-3xl glass border border-dashed border-border/50 text-center space-y-3">
          <p className="text-muted-foreground font-medium">Want to join the discussion?</p>
          <Link href="/login">
            <Button variant="outline" className="rounded-xl px-8">
              Log in to comment
            </Button>
          </Link>
        </div>
      )}

      <div className="space-y-8">
        {commentTree.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            postId={postId} 
            userProfile={userProfile}
            isAdmin={isAdmin}
          />
        ))}
        {optimisticComments.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/30">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground italic font-medium">No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  )
}

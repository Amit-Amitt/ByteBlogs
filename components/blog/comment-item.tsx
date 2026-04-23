'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addComment, deleteComment } from '@/actions/comments'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { User as UserIcon, Send, Loader2, Reply, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Comment, Profile } from '@/types'
import { cn } from '@/lib/utils'

interface CommentItemProps {
  comment: Comment & { replies: Comment[] }
  postId: string
  userProfile: Profile | null
  isAdmin: boolean
  level?: number
}

export default function CommentItem({ comment, postId, userProfile, isAdmin, level = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  const isOwner = userProfile?.id === comment.user_id
  const canDelete = isOwner || isAdmin

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return

    startTransition(async () => {
      const result = await addComment(postId, replyContent, comment.id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Reply added')
        setReplyContent('')
        setIsReplying(false)
        setIsExpanded(true)
      }
    })
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this comment? All replies will also be deleted.')) return
    
    startTransition(async () => {
      const result = await deleteComment(comment.id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Comment deleted')
      }
    })
  }

  return (
    <div className={cn("space-y-4", level > 0 && "ml-4 md:ml-8 pl-4 border-l-2 border-border/50")}>
      <div className="group flex space-x-4 p-4 rounded-2xl hover:bg-accent/30 transition-all duration-300 border border-transparent hover:border-border/50">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center border border-indigo-500/20">
          <UserIcon className="w-5 h-5 text-indigo-500" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-foreground text-sm tracking-tight">{comment.user?.name || 'Anonymous'}</span>
              {isOwner && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">You</span>}
              <span className="text-[10px] text-muted-foreground/60">•</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{formatDate(comment.created_at)}</span>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
              {canDelete && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            {userProfile && (
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs font-bold text-primary hover:text-primary/80 flex items-center transition-colors"
              >
                <Reply className="w-3 h-3 mr-1" />
                {isReplying ? 'Cancel' : 'Reply'}
              </button>
            )}
            
            {comment.replies.length > 0 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center transition-colors"
              >
                {isExpanded ? (
                  <><ChevronUp className="w-3 h-3 mr-1" /> Hide Replies ({comment.replies.length})</>
                ) : (
                  <><ChevronDown className="w-3 h-3 mr-1" /> Show Replies ({comment.replies.length})</>
                )}
              </button>
            )}
          </div>

          {isReplying && (
            <form onSubmit={handleReply} className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Textarea 
                placeholder={`Replying to ${comment.user?.name}...`} 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={isPending}
                className="bg-muted/30 min-h-[80px] rounded-xl text-sm"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsReplying(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isPending || !replyContent.trim()} className="h-8 text-xs">
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                  Reply
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {isExpanded && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply as any} 
              postId={postId} 
              userProfile={userProfile} 
              isAdmin={isAdmin}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

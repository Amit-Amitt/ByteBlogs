'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { toggleSavePost } from '@/actions/profile'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function SaveButton({ postId, initiallySaved }: { postId: string, initiallySaved: boolean }) {
  const [isSaved, setIsSaved] = useState(initiallySaved)
  const [isPending, startTransition] = useTransition()

  async function handleToggle() {
    startTransition(async () => {
      const result = await toggleSavePost(postId, isSaved)
      if (result.error) {
        toast.error(result.error)
      } else {
        setIsSaved(!isSaved)
        toast.success(isSaved ? 'Removed from saved' : 'Saved to profile')
      }
    })
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleToggle} 
      disabled={isPending}
      className={cn(
        "rounded-full transition-all duration-300",
        isSaved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
      )}
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="w-5 h-5 fill-current" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </Button>
  )
}

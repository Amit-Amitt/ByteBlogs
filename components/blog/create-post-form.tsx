'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Image as ImageIcon } from 'lucide-react'
import { createPost } from '@/actions/posts'

export default function CreatePostForm() {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createPost(formData)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-8 rounded-2xl glass border border-border shadow-2xl">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight gradient-text">Create New Post</h1>
        <p className="text-muted-foreground">Share your thoughts with the world. AI will handle the summary.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/70 ml-1">Title</label>
        <Input name="title" placeholder="A catchy title..." required disabled={loading} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/70 ml-1">Cover Image</label>
        <div className="flex items-center space-x-4">
          <label className="flex-1 cursor-pointer">
            <div className="h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs">Click to upload image</span>
                </>
              )}
            </div>
            <input type="file" name="image" className="hidden" accept="image/*" onChange={handleImageChange} disabled={loading} />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/70 ml-1">Content</label>
        <Textarea 
          name="body" 
          placeholder="Write your story here..." 
          required 
          className="min-h-[300px]" 
          disabled={loading} 
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating AI Summary & Publishing...
            </>
          ) : 'Publish Post'}
        </Button>
      </div>
    </form>
  )
}

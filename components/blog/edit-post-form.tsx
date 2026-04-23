'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Image as ImageIcon } from 'lucide-react'
import { updatePost } from '@/actions/posts'
import { Post } from '@/types'

export default function EditPostForm({ post }: { post: Post }) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(post.image_url)

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
    const result = await updatePost(post.id, formData)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Post updated successfully')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-8 rounded-2xl glass border border-zinc-800 shadow-2xl">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight gradient-text">Edit Post</h1>
        <p className="text-zinc-400">Update your content and keep your readers engaged.</p>
      </div>

      <input type="hidden" name="currentImageUrl" value={post.image_url || ''} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300 ml-1">Title</label>
        <Input name="title" defaultValue={post.title} placeholder="A catchy title..." required disabled={loading} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300 ml-1">Cover Image</label>
        <div className="flex items-center space-x-4">
          <label className="flex-1 cursor-pointer">
            <div className="h-32 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500 hover:text-indigo-400 hover:border-indigo-400/50 transition-all">
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
        <label className="text-sm font-medium text-zinc-300 ml-1">Content</label>
        <Textarea 
          name="body" 
          defaultValue={post.body}
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
              Updating Post...
            </>
          ) : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

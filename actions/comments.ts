'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(postId: string, content: string, parentId?: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    content,
    parent_id: parentId || null
  })

  if (error) return { error: error.message }

  revalidatePath(`/posts/[slug]`)
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  
  if (error) return { error: error.message }
  
  revalidatePath(`/posts/[slug]`)
}

export async function getComments(postId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*, user:profiles(*)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return data
}

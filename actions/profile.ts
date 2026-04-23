'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Update profile name
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', user.id)

  if (profileError) return { error: profileError.message }

  // Update Auth Email/Password if provided
  if (email !== user.email || password) {
    const { error: authError } = await supabase.auth.updateUser({
      email,
      password: password || undefined
    })
    if (authError) return { error: authError.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function toggleSavePost(postId: string, isSaved: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'You must be logged in to save posts.' }

  if (isSaved) {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId)
    
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('saved_posts')
      .insert({ user_id: user.id, post_id: postId })
    
    if (error) return { error: error.message }
  }

  revalidatePath(`/posts`)
  revalidatePath(`/profile`)
  return { success: true }
}

export async function getSavedPosts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('saved_posts')
    .select('post_id, posts(*, author:profiles(*))')
    .eq('user_id', user.id)

  if (error) throw error
  
  // item.posts can be an object or an array depending on how Supabase interprets the relation
  // We ensure it's treated as an object and filter out any potential nulls
  return (data || []).map(item => {
    if (Array.isArray(item.posts)) return item.posts[0]
    return item.posts
  }).filter(Boolean) as any[]
}

export async function checkIfSaved(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  return !!data
}

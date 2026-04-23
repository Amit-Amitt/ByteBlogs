'use server'

import { createClient } from '@/lib/supabase/server'
import { generateSummaryWithRetry } from '@/lib/gemini'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Basic Rate Limiting: Check for posts in the last 1 minute
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id')
    .eq('author_id', user.id)
    .gt('created_at', oneMinuteAgo)

  if (recentPosts && recentPosts.length > 0) {
    return { error: 'Please wait a minute before publishing another post.' }
  }

  const title = formData.get('title') as string
  const body = formData.get('body') as string
  const image = formData.get('image') as File
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

  let image_url = null

  if (image && image.size > 0) {
    const fileName = `${user.id}/${Date.now()}-${image.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, image)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: `Image upload failed: ${uploadError.message}` }
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)
      image_url = publicUrl
    }
  }

  // AI Summary Generation
  let summary = null
  try {
    summary = await generateSummaryWithRetry(title, body)
  } catch (error: any) {
    console.error('AI Summary failed:', error)
    return { error: `AI Summary generation failed. Please try again.` }
  }

  const { error } = await supabase.from('posts').insert({
    title,
    body,
    slug,
    image_url,
    summary,
    author_id: user.id
  })

  if (error) {
    console.error('DB Insert error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  redirect(`/posts/${slug}`)
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath('/')
  redirect('/')
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const body = formData.get('body') as string
  const image = formData.get('image') as File
  const currentImageUrl = formData.get('currentImageUrl') as string
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

  let image_url = currentImageUrl

  if (image && image.size > 0) {
    const fileName = `${user.id}/${Date.now()}-${image.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, image)

    if (uploadError) {
      console.error('Upload error:', uploadError)
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)
      image_url = publicUrl
    }
  }

  // AI Summary Generation
  let summary = null
  try {
    summary = await generateSummaryWithRetry(title, body)
  } catch (error: any) {
    console.error('AI Summary Update failed:', error)
  }

  const { error } = await supabase
    .from('posts')
    .update({
      title,
      body,
      slug,
      image_url,
      summary: summary || undefined,
      updated_at: new Date().toISOString()
    })
    .eq('id', postId)

  if (error) {
    console.error('DB Update error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/posts/${slug}`)
  redirect(`/posts/${slug}`)
}

export async function getPosts(page = 1, limit = 10, search = '') {
  const supabase = await createClient()
  const start = (page - 1) * limit
  const end = start + limit - 1

  let query = supabase
    .from('posts')
    .select('*, author:profiles(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end)

  if (search) {
    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) throw error

  return { data, count }
}

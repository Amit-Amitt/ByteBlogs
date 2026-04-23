import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/auth'
import { notFound, redirect } from 'next/navigation'
import EditPostForm from '@/components/blog/edit-post-form'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const profile = await getProfile()
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) {
    notFound()
  }

  // Check if user is author or admin
  const isAuthor = profile?.id === post.author_id
  const isAdmin = profile?.role === 'admin'

  if (!isAuthor && !isAdmin) {
    redirect(`/posts/${slug}`)
  }

  return (
    <div className="py-12">
      <EditPostForm post={post as any} />
    </div>
  )
}

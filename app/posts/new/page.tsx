import CreatePostForm from '@/components/blog/create-post-form'
import { getProfile } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function NewPostPage() {
  const profile = await getProfile()

  if (!profile || (profile.role !== 'author' && profile.role !== 'admin')) {
    redirect('/')
  }

  return (
    <div className="py-12">
      <CreatePostForm />
    </div>
  )
}

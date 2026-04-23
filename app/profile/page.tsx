import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/auth'
import { getSavedPosts } from '@/actions/profile'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/profile/profile-form'
import PostCard from '@/components/blog/post-card'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile()
  const savedPosts = await getSavedPosts()

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Profile Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Settings</h2>
            <ProfileForm user={user} profile={profile} />
          </div>
        </div>

        {/* Right: Saved Posts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">Saved Posts</h2>
            <span className="px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium">
              {savedPosts.length} items
            </span>
          </div>

          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPosts.map((post) => (
                <PostCard key={post.id} post={post as any} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center glass rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground">You haven't saved any posts yet. Start exploring!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

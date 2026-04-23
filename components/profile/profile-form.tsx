'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, User, Mail, Lock } from 'lucide-react'
import { updateProfile } from '@/actions/profile'

export default function ProfileForm({ user, profile }: { user: any, profile: any }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await updateProfile(formData)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Profile updated successfully')
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6 p-8 rounded-2xl glass border border-border">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
          {profile?.name?.charAt(0) || user?.email?.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{profile?.name || 'Your Profile'}</h2>
          <p className="text-sm text-muted-foreground capitalize">{profile?.role} Account</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70 flex items-center">
            <User className="w-4 h-4 mr-2" /> Name
          </label>
          <Input name="name" defaultValue={profile?.name} placeholder="Your name" required disabled={loading} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70 flex items-center">
            <Mail className="w-4 h-4 mr-2" /> Email
          </label>
          <Input name="email" type="email" defaultValue={user?.email} placeholder="your@email.com" required disabled={loading} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70 flex items-center">
            <Lock className="w-4 h-4 mr-2" /> New Password
          </label>
          <Input name="password" type="password" placeholder="Leave blank to keep current" disabled={loading} />
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Update Profile'}
      </Button>
    </form>
  )
}

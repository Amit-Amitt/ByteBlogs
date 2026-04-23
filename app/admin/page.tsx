import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2, Shield, User, FileText, MessageSquare } from 'lucide-react'

export default async function AdminPage() {
  const profile = await getProfile()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  const supabase = await createClient()

  // Fetch stats
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true })
  const { count: commentCount } = await supabase.from('comments').select('*', { count: 'exact', head: true })

  // Fetch recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-10 py-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-indigo-500" />
            Admin Dashboard
          </h1>
          <p className="text-zinc-400">Manage your platform and monitor activity.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: userCount, icon: User, color: 'text-blue-400' },
          { label: 'Total Posts', value: postCount, icon: FileText, color: 'text-indigo-400' },
          { label: 'Total Comments', value: commentCount, icon: MessageSquare, color: 'text-violet-400' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl glass border border-zinc-800 flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-zinc-900 border border-zinc-800 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-zinc-100">{stat.value || 0}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">Recent Users</h2>
          <div className="rounded-2xl glass border border-zinc-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-zinc-800">
                {recentUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-zinc-200">{user.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        user.role === 'admin' ? 'bg-red-500/10 text-red-400' : 
                        user.role === 'author' ? 'bg-indigo-500/10 text-indigo-400' : 
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Logs / Placeholder */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">System Status</h2>
          <div className="p-8 rounded-2xl glass border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <span className="text-sm font-medium text-green-400">Supabase Connection</span>
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-md font-bold uppercase">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
              <span className="text-sm font-medium text-indigo-400">Gemini AI Model</span>
              <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md font-bold uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-800/30 border border-zinc-800 rounded-xl">
              <span className="text-sm font-medium text-zinc-400">Vercel Deployment</span>
              <span className="text-xs px-2 py-1 bg-zinc-700 text-zinc-300 rounded-md font-bold uppercase">Production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

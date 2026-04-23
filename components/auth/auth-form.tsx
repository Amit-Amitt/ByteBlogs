'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { signIn, signUp } from '@/actions/auth'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = mode === 'login' ? await signIn(formData) : await signUp(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 w-full max-w-md p-8 rounded-2xl glass border border-border shadow-2xl">
      <div className="space-y-2 text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {mode === 'login' ? 'Enter your credentials to access your account' : 'Join our premium community of writers'}
        </p>
      </div>

      {mode === 'signup' && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground/70 ml-1">Name</label>
          <Input name="name" placeholder="John Doe" required disabled={loading} />
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground/70 ml-1">Email</label>
        <Input name="email" type="email" placeholder="name@example.com" required disabled={loading} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground/70 ml-1">Password</label>
        <Input name="password" type="password" placeholder="••••••••" required disabled={loading} />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'login' ? 'Login' : 'Sign Up')}
      </Button>

      <div className="text-center text-sm text-muted-foreground pt-4">
        {mode === 'login' ? (
          <p>Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a></p>
        ) : (
          <p>Already have an account? <a href="/login" className="text-primary hover:underline">Login</a></p>
        )}
      </div>
    </form>
  )
}

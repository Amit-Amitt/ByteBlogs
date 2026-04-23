import AuthForm from '@/components/auth/auth-form'

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <AuthForm mode="signup" />
    </div>
  )
}

import AuthForm from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <AuthForm mode="login" />
    </div>
  )
}

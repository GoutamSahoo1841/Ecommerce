import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Sign In - NOVA',
  description: 'Sign in to your NOVA account.',
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}

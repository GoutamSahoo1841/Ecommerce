import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Create Account - NOVA',
  description: 'Create your NOVA account and start shopping.',
}

export default function RegisterPage() {
  return <AuthForm mode="register" />
}

import type { Metadata } from 'next'
import { AccountContent } from '@/components/account-content'

export const metadata: Metadata = {
  title: 'My Account - NOVA',
  description: 'Manage your NOVA account settings and preferences.',
}

export default function AccountPage() {
  return <AccountContent />
}

import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin-dashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - NOVA',
  description: 'NOVA store administration panel.',
}

export default function AdminPage() {
  return <AdminDashboard />
}

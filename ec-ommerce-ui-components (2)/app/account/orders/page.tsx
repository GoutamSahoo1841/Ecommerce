import type { Metadata } from 'next'
import { OrdersContent } from '@/components/orders-content'

export const metadata: Metadata = {
  title: 'Order History - NOVA',
  description: 'View and track your orders.',
}

export default function OrdersPage() {
  return <OrdersContent />
}

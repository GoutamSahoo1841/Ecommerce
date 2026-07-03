import type { Metadata } from 'next'
import { CartContent } from '@/components/cart-content'

export const metadata: Metadata = {
  title: 'Shopping Cart - NOVA',
  description: 'View and manage items in your shopping cart.',
}

export default function CartPage() {
  return <CartContent />
}

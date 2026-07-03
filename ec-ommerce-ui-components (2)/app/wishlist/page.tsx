import type { Metadata } from 'next'
import { WishlistContent } from '@/components/wishlist-content'

export const metadata: Metadata = {
  title: 'Wishlist - NOVA',
  description: 'View and manage your saved items.',
}

export default function WishlistPage() {
  return <WishlistContent />
}

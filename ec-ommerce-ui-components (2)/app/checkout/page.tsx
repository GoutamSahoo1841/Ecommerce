import type { Metadata } from 'next'
import { CheckoutContent } from '@/components/checkout-content'

export const metadata: Metadata = {
  title: 'Checkout - NOVA',
  description: 'Complete your purchase securely.',
}

export default function CheckoutPage() {
  return <CheckoutContent />
}

import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ProductsContent } from '@/components/products-content'

export const metadata: Metadata = {
  title: 'Products - NOVA',
  description: 'Browse our collection of premium tech products.',
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20" />}>
      <ProductsContent />
    </Suspense>
  )
}

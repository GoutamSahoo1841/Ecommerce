import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductDetail } from '@/components/product-detail'
import { getProductById, products } from '@/lib/products'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)
  
  if (!product) {
    return { title: 'Product Not Found - NOVA' }
  }

  return {
    title: `${product.name} - NOVA`,
    description: product.description,
  }
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}

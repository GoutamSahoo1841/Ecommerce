'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/product-card'
import { getOnSaleProducts } from '@/lib/products'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export default function DealsPage() {
  const saleProducts = getOnSaleProducts()

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 text-center sm:p-12"
        >
          <Badge variant="secondary" className="mb-4 bg-primary/20">
            Limited Time Offers
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Special Deals
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Save big on our best-selling products. These exclusive offers won&apos;t last long,
            so grab your favorites before they&apos;re gone!
          </p>
        </motion.div>

        {/* Products */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {saleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

        {saleProducts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No deals available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

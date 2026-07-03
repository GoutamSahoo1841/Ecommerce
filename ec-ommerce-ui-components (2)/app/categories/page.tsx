import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Package } from 'lucide-react'
import { categories, products } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Categories - NOVA',
  description: 'Browse products by category.',
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shop by Category
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find exactly what you&apos;re looking for
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(1).map((category) => {
            const categoryProducts = products.filter(
              (p) => p.category.toLowerCase() === category.name.toLowerCase()
            )
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50">
                  {(() => {
                    const categoryImages: Record<string, string> = {
                      'audio': '/images/category-audio.png',
                      'wearables': '/images/category-wearables.png',
                      'accessories': '/images/category-accessories.png',
                      'storage': '/images/category-storage.png',
                      'smart-home': '/images/category-audio.png',
                      'gaming': '/images/category-gaming.png',
                    }
                    const imagePath = categoryImages[category.slug]
                    return imagePath ? (
                      <img
                        src={imagePath}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-16 w-16 text-muted-foreground/20" />
                      </div>
                    )
                  })()}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.count} products
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

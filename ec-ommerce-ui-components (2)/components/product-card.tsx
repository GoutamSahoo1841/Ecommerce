'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore, type Product } from '@/lib/store'
import { cardHover, buttonTap, fadeInUp } from '@/lib/animations'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { state, dispatch } = useStore()
  const isWishlisted = state.wishlist.some((item) => item.id === product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity: 1 },
    })
    toast.success('Added to cart', {
      description: product.name,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })
      toast.info('Removed from wishlist')
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
      toast.success('Added to wishlist')
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/products/${product.id}`}>
        <motion.div
          whileHover={cardHover}
          className="group relative overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg"
        >
          {/* Image */}
          <div className="group/image relative aspect-square overflow-hidden bg-muted">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover/image:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {product.badge && (
                <Badge
                  variant={product.badge === 'Sale' ? 'destructive' : 'secondary'}
                  className="shadow-sm"
                >
                  {product.badge}
                </Badge>
              )}
              {product.originalPrice && (
                <Badge variant="secondary" className="shadow-sm">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              whileTap={buttonTap}
              onClick={handleToggleWishlist}
              className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-colors ${
                isWishlisted ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>

            {/* Quick Add */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100"
            >
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full shadow-lg"
                size="sm"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1 line-clamp-1 font-semibold text-foreground">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews.toLocaleString('en-US')})
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <div className="absolute inset-0 shimmer" />
      </div>
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded-full bg-muted shimmer" />
        <div className="h-5 w-full rounded-full bg-muted shimmer" />
        <div className="h-4 w-24 rounded-full bg-muted shimmer" />
        <div className="h-6 w-20 rounded-full bg-muted shimmer" />
      </div>
    </div>
  )
}

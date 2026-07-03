'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Trash2, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { useStore } from '@/lib/store'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { toast } from 'sonner'

export function WishlistContent() {
  const { state, dispatch } = useStore()

  const handleClearWishlist = () => {
    state.wishlist.forEach((item) =>
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item.id })
    )
    toast.success('Wishlist cleared')
  }

  const handleAddAllToCart = () => {
    state.wishlist.forEach((item) =>
      dispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity: 1 } })
    )
    toast.success('All items added to cart')
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Wishlist</span>
        </motion.nav>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
            <p className="mt-1 text-muted-foreground">
              {state.wishlist.length} items saved
            </p>
          </div>
          {state.wishlist.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearWishlist}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
              <Button onClick={handleAddAllToCart}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add All to Cart
              </Button>
            </div>
          )}
        </motion.div>

        {state.wishlist.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Save your favorite items to your wishlist for later.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {state.wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Minus,
  Plus,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCard } from '@/components/product-card'
import { useStore, type Product } from '@/lib/store'
import { products } from '@/lib/products'
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '@/lib/animations'
import { toast } from 'sonner'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
  const { state, dispatch } = useStore()
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0])
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const isWishlisted = state.wishlist.some((item) => item.id === product.id)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  useEffect(() => {
    dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product })
  }, [product, dispatch])

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity,
        selectedColor,
        selectedSize,
      },
    })
    toast.success('Added to cart', {
      description: `${product.name} x ${quantity}`,
    })
  }

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })
      toast.info('Removed from wishlist')
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
      toast.success('Added to wishlist')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
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
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </motion.nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <div className="group relative aspect-square overflow-hidden rounded-3xl bg-muted">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex h-full w-full items-center justify-center"
                >
                  {product.images && product.images[currentImageIndex] ? (
                    <img
                      src={product.images[currentImageIndex]}
                      alt={`${product.name} view ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <ShoppingBag className="h-32 w-32 text-muted-foreground/20" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.badge && (
                  <Badge
                    variant={product.badge === 'Sale' ? 'destructive' : 'secondary'}
                  >
                    {product.badge}
                  </Badge>
                )}
                {product.originalPrice && (
                  <Badge variant="secondary">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Image Navigation */}
              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? product.images!.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === product.images!.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-16 w-16 overflow-hidden rounded-lg bg-muted transition-all ${
                      currentImageIndex === index
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            <div className="flex-1">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                {product.category}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews.toLocaleString('en-US')} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-4xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <p className="mt-6 text-muted-foreground">{product.description}</p>

              <Separator className="my-6" />

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium">
                    Color: <span className="text-muted-foreground">{selectedColor}</span>
                  </h3>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex h-10 items-center justify-center rounded-lg border px-4 text-sm transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {selectedColor === color && (
                          <Check className="mr-2 h-4 w-4 text-primary" />
                        )}
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium">
                    Size: <span className="text-muted-foreground">{selectedSize}</span>
                  </h3>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-10 w-16 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sticky Purchase Panel */}
            <div className="sticky bottom-20 -mx-4 mt-6 rounded-2xl bg-card p-4 shadow-lg md:bottom-4">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleWishlist}
                  className={isWishlisted ? 'text-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: '2 Year Warranty' },
                { icon: RotateCcw, label: '30-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-4 text-center"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                <p>{product.description}</p>
                <p>
                  Experience premium quality with our {product.name}. Designed for
                  modern living, this product combines cutting-edge technology with
                  elegant design to deliver an unparalleled experience.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Rating', value: `${product.rating} / 5` },
                  { label: 'Reviews', value: product.reviews.toLocaleString('en-US') },
                  { label: 'In Stock', value: product.inStock ? 'Yes' : 'No' },
                  ...(product.colors ? [{ label: 'Colors', value: product.colors.join(', ') }] : []),
                  ...(product.sizes ? [{ label: 'Sizes', value: product.sizes.join(', ') }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-4">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Reviews coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="mb-8 text-2xl font-bold">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Recently Viewed */}
        {state.recentlyViewed.length > 1 && (
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="mb-8 text-2xl font-bold">Recently Viewed</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {state.recentlyViewed
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

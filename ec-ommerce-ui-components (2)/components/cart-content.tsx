'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/lib/store'
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations'
import { toast } from 'sonner'
import { useState } from 'react'

export function CartContent() {
  const { state, dispatch, cartTotal, cartCount } = useStore()
  const [promoCode, setPromoCode] = useState('')

  const shipping = cartTotal > 100 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shipping + tax

  const handleApplyPromo = () => {
    if (promoCode) {
      toast.info('Promo codes coming soon!')
      setPromoCode('')
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
          <span className="text-foreground">Shopping Cart</span>
        </motion.nav>

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 text-3xl font-bold tracking-tight"
        >
          Shopping Cart
          {cartCount > 0 && (
            <span className="ml-2 text-muted-foreground">({cartCount} items)</span>
          )}
        </motion.h1>

        {state.cart.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {state.cart.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                      variants={staggerItem}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="group flex gap-4 rounded-2xl bg-card p-4 shadow-sm sm:gap-6"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-32">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/products/${item.id}`}
                            className="font-semibold hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            {item.selectedColor && <span>{item.selectedColor}</span>}
                            {item.selectedSize && (
                              <>
                                <span>·</span>
                                <span>{item.selectedSize}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                item.quantity > 1
                                  ? dispatch({
                                      type: 'UPDATE_QUANTITY',
                                      payload: {
                                        id: item.id,
                                        quantity: item.quantity - 1,
                                      },
                                    })
                                  : dispatch({
                                      type: 'REMOVE_FROM_CART',
                                      payload: item.id,
                                    })
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_QUANTITY',
                                  payload: {
                                    id: item.id,
                                    quantity: item.quantity + 1,
                                  },
                                })
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                dispatch({
                                  type: 'REMOVE_FROM_CART',
                                  payload: item.id,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:sticky lg:top-24"
            >
              <div className="rounded-2xl bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                {/* Promo Code */}
                <div className="mt-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button variant="outline" onClick={handleApplyPromo}>
                      Apply
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      <span>${shipping.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Free shipping on orders over $100
                  </p>
                )}

                <Button asChild size="lg" className="mt-6 w-full">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Secure checkout powered by</span>
                  <span className="font-medium text-foreground">Stripe</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

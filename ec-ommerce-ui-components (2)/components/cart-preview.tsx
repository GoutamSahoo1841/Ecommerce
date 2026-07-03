'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/lib/store'
import { slideInFromRight, staggerContainer, staggerItem } from '@/lib/animations'

interface CartPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartPreview({ open, onOpenChange }: CartPreviewProps) {
  const { state, dispatch, cartTotal, cartCount } = useStore()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {cartCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                {cartCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {state.cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-center text-muted-foreground">
              Your cart is empty
            </p>
            <Button onClick={() => onOpenChange(false)} asChild>
              <Link href="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4 py-4"
              >
                <AnimatePresence mode="popLayout">
                  {state.cart.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                      variants={staggerItem}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex gap-4 rounded-xl bg-card p-3 shadow-sm"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="line-clamp-1 font-medium">{item.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {item.selectedColor && <span>{item.selectedColor}</span>}
                            {item.selectedSize && (
                              <>
                                <span>·</span>
                                <span>{item.selectedSize}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
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
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
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
                          <span className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() =>
                          dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>

            <div className="space-y-4 border-t border-border pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Button asChild size="lg" onClick={() => onOpenChange(false)}>
                  <Link href="/checkout">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

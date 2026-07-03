'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  ShoppingBag,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/lib/store'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  shipped: { icon: Truck, color: 'text-primary', bg: 'bg-primary/10' },
  delivered: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
}

export function OrdersContent() {
  const { state } = useStore()

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
          <Link href="/account" className="hover:text-foreground">
            Account
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Orders</span>
        </motion.nav>

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 text-3xl font-bold tracking-tight"
        >
          Order History
        </motion.h1>

        {state.orders.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-muted-foreground">
              When you place orders, they&apos;ll appear here.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {state.orders.map((order) => {
              const config = statusConfig[order.status]
              const StatusIcon = config.icon

              return (
                <motion.div
                  key={order.id}
                  variants={staggerItem}
                  className="rounded-2xl bg-card p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{order.id}</h3>
                        <Badge
                          variant="secondary"
                          className={`${config.bg} ${config.color}`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-lg bg-muted">
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            {item.selectedColor && (
                              <>
                                <span>·</span>
                                <span>{item.selectedColor}</span>
                              </>
                            )}
                            {item.selectedSize && (
                              <>
                                <span>·</span>
                                <span>{item.selectedSize}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Shipping Info */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Shipping Address</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.name}, {order.shippingAddress.address},{' '}
                        {order.shippingAddress.city} {order.shippingAddress.zip}
                      </p>
                    </div>
                    <Button variant="outline">Track Order</Button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

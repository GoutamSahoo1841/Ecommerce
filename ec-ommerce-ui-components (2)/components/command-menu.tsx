'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Package,
  Home,
  ShoppingBag,
  Heart,
  User,
  Settings,
  Sparkles,
  ArrowRight,
  Tag,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { products, categories } from '@/lib/products'

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false)
      command()
    },
    [onOpenChange]
  )

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl sm:max-w-[600px]">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b border-border px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search products, categories, or pages..."
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {search && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
              >
                <Sparkles className="h-3 w-3" />
                AI Search
              </motion.div>
            )}
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {!search && (
              <>
                <Command.Group heading="Quick Actions">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push('/'))}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>Home</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push('/products'))}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>All Products</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push('/cart'))}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span>View Cart</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push('/wishlist'))}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>Wishlist</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push('/account'))}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Account</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Categories">
                  {categories.slice(1).map((category) => (
                    <Command.Item
                      key={category.slug}
                      onSelect={() =>
                        runCommand(() => router.push(`/products?category=${category.slug}`))
                      }
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {category.count} items
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </>
            )}

            {search && filteredProducts.length > 0 && (
              <Command.Group heading="Products">
                {filteredProducts.slice(0, 6).map((product) => (
                  <Command.Item
                    key={product.id}
                    onSelect={() =>
                      runCommand(() => router.push(`/products/${product.id}`))
                    }
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category} · ${product.price}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                  ↵
                </kbd>
                <span>to select</span>
                <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                  esc
                </kbd>
                <span>to close</span>
              </div>
              <span>Powered by AI</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

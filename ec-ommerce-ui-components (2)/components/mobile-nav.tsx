'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'
import { useStore } from '@/lib/store'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: Search, label: 'Search' },
  { href: '/cart', icon: ShoppingBag, label: 'Cart', showBadge: true },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/account', icon: User, label: 'Account' },
]

export function MobileNav() {
  const pathname = usePathname()
  const { cartCount } = useStore()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border md:hidden"
    >
      <div className="flex items-center justify-around py-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 px-3 py-2"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative rounded-xl p-2 transition-colors ${
                  isActive ? 'bg-primary/10' : ''
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                {item.showBadge && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-2 h-1 w-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}

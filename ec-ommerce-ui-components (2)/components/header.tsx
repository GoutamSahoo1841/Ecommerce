'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Command,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useStore } from '@/lib/store'
import { CommandMenu } from './command-menu'
import { CartPreview } from './cart-preview'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/deals', label: 'Deals' },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { cartCount, state } = useStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xl font-bold tracking-tight text-foreground"
              >
                NOVA
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary"
                        layoutId="nav-indicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCommandOpen(true)}
                className="relative"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
                <kbd className="pointer-events-none absolute -bottom-1 right-0 hidden rounded border border-border bg-muted px-1 text-[10px] font-medium text-muted-foreground sm:block">
                  <Command className="inline h-2.5 w-2.5" />K
                </kbd>
              </Button>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === 'dark' ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {state.wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                    >
                      {state.wishlist.length}
                    </motion.span>
                  )}
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                  >
                    {cartCount}
                  </motion.span>
                )}
                <span className="sr-only">Cart</span>
              </Button>

              {/* User */}
              <Link href="/account" className="hidden sm:block">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="mt-8 flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-lg font-medium transition-colors ${
                          pathname === link.href
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/account"
                      className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Account
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Command Menu */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />

      {/* Cart Preview */}
      <CartPreview open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}

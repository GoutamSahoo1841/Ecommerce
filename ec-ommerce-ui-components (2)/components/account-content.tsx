'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Edit,
  Camera,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { toast } from 'sonner'

const menuItems = [
  { icon: User, label: 'Profile', href: '/account' },
  { icon: Package, label: 'Orders', href: '/account/orders' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
  { icon: CreditCard, label: 'Payment Methods', href: '/account/payments' },
  { icon: Bell, label: 'Notifications', href: '/account/notifications' },
  { icon: Shield, label: 'Security', href: '/account/security' },
  { icon: Settings, label: 'Settings', href: '/account/settings' },
]

export function AccountContent() {
  const router = useRouter()
  const { state, dispatch } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: state.user?.name || 'John Doe',
    email: state.user?.email || 'john@example.com',
    phone: '+1 (555) 000-0000',
    bio: 'Tech enthusiast and gadget lover.',
  })

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null })
    toast.success('Logged out successfully')
    router.push('/')
  }

  const handleSaveProfile = () => {
    dispatch({
      type: 'SET_USER',
      payload: { name: profileData.name, email: profileData.email },
    })
    setIsEditing(false)
    toast.success('Profile updated')
  }

  if (!state.user) {
    return (
      <div className="min-h-screen pt-20">
        <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Sign in to your account</h2>
          <p className="mt-2 text-muted-foreground">
            Access your orders, wishlist, and account settings.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
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
          <span className="text-foreground">My Account</span>
        </motion.nav>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <motion.aside
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="rounded-2xl bg-card p-6 shadow-sm">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={state.user.avatar} />
                  <AvatarFallback className="text-lg">
                    {state.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{state.user.name}</h2>
                  <p className="text-sm text-muted-foreground">{state.user.email}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <div className="rounded-2xl bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">My Profile</h1>
                  <p className="text-muted-foreground">
                    Manage your personal information
                  </p>
                </div>
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Profile Form */}
              <div className="grid gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={state.user.avatar} />
                      <AvatarFallback className="text-2xl">
                        {state.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{state.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Member since January 2024
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Full Name</label>
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Phone</label>
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Bio</label>
                    <Input
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold">{state.orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold">{state.wishlist.length}</p>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold">
                    ${state.orders.reduce((acc, o) => acc + o.total, 0).toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            {state.orders.length > 0 && (
              <div className="mt-8 rounded-2xl bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  <Button variant="ghost" asChild>
                    <Link href="/account/orders">View All</Link>
                  </Button>
                </div>

                <div className="mt-6 space-y-4">
                  {state.orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-xl bg-muted/50 p-4"
                    >
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <Badge
                          variant={
                            order.status === 'delivered'
                              ? 'default'
                              : order.status === 'shipped'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

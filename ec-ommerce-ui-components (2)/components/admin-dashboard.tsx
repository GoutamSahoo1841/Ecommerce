'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MoreVertical,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { products } from '@/lib/products'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'

// Sample data for charts
const revenueData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 5000, orders: 320 },
  { name: 'Apr', revenue: 4500, orders: 280 },
  { name: 'May', revenue: 6000, orders: 380 },
  { name: 'Jun', revenue: 5500, orders: 340 },
  { name: 'Jul', revenue: 7000, orders: 420 },
]

const categoryData = [
  { name: 'Audio', value: 35 },
  { name: 'Wearables', value: 25 },
  { name: 'Accessories', value: 20 },
  { name: 'Storage', value: 12 },
  { name: 'Other', value: 8 },
]

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', amount: 349, status: 'completed' },
  { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', amount: 499, status: 'processing' },
  { id: 'ORD-003', customer: 'Bob Wilson', email: 'bob@example.com', amount: 129, status: 'pending' },
  { id: 'ORD-004', customer: 'Alice Brown', email: 'alice@example.com', amount: 199, status: 'completed' },
  { id: 'ORD-005', customer: 'Charlie Davis', email: 'charlie@example.com', amount: 79, status: 'shipped' },
]

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', active: true },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      title: 'Active Customers',
      value: '573',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Page Views',
      value: '12,543',
      change: '-2.4%',
      trend: 'down',
      icon: Eye,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card lg:block">
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/admin" className="text-xl font-bold">
              NOVA Admin
            </Link>
          </div>
          <nav className="space-y-1 p-4">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  item.active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">View Store</Link>
              </Button>
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="p-6">
            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat) => (
                <motion.div key={stat.title} variants={staggerItem}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="flex items-center gap-1 text-xs">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        )}
                        <span
                          className={
                            stat.trend === 'up' ? 'text-success' : 'text-destructive'
                          }
                        >
                          {stat.change}
                        </span>
                        <span className="text-muted-foreground">vs last month</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts */}
            <div className="mt-6 grid gap-6 lg:grid-cols-7">
              {/* Revenue Chart */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-4"
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Revenue Overview</CardTitle>
                    <Tabs value={timeRange} onValueChange={setTimeRange}>
                      <TabsList className="h-8">
                        <TabsTrigger value="7d" className="text-xs">
                          7D
                        </TabsTrigger>
                        <TabsTrigger value="30d" className="text-xs">
                          30D
                        </TabsTrigger>
                        <TabsTrigger value="90d" className="text-xs">
                          90D
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="hsl(var(--primary))"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Category Distribution */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-3"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {categoryData.map((category, index) => (
                        <div key={category.name} className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {category.name} ({category.value}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Recent Orders */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs">
                                {order.customer
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{order.customer}</p>
                              <p className="text-xs text-muted-foreground">
                                {order.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">${order.amount}</span>
                            <Badge
                              variant={
                                order.status === 'completed'
                                  ? 'default'
                                  : order.status === 'processing'
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
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Products */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Products</CardTitle>
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${product.price}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.reviews} sold
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

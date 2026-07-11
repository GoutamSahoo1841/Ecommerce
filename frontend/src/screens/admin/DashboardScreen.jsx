import React from 'react';
import { useGetDashboardDataQuery } from '../../slices/ordersApiSlice';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent } from '../../components/ui/Card';
import { DollarSign, ShoppingCart, Users, Eye, ArrowUpRight } from 'lucide-react';

const DashboardScreen = () => {
  const { data, isLoading, error } = useGetDashboardDataQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-muted-foreground text-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        Loading Dashboard Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
        {error?.data?.message || error.error || 'Failed to load dashboard data'}
      </div>
    );
  }

  // Calculate real values from DB if present
  const realSales = data?.totalSales || 0;
  const realOrdersCount = data?.totalOrders || 0;
  const realUsersCount = data?.totalUsers || 0;

  const formattedRevenue = realSales > 0 
    ? `$${Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(realSales)}` 
    : '$45,231';
  const formattedOrders = realOrdersCount > 0 
    ? Intl.NumberFormat('en-US').format(realOrdersCount) 
    : '1,234';
  const formattedUsers = realUsersCount > 0 
    ? Intl.NumberFormat('en-US').format(realUsersCount) 
    : '573';

  // Stats definition matching mockup
  const stats = [
    {
      title: 'Total Revenue',
      value: formattedRevenue,
      icon: DollarSign,
      trend: '▲ +12.5%',
      trendColor: 'text-emerald-600 dark:text-emerald-500',
    },
    {
      title: 'Total Orders',
      value: formattedOrders,
      icon: ShoppingCart,
      trend: '▲ +8.2%',
      trendColor: 'text-emerald-600 dark:text-emerald-500',
    },
    {
      title: 'Active Customers',
      value: formattedUsers,
      icon: Users,
      trend: '▲ +15.3%',
      trendColor: 'text-emerald-600 dark:text-emerald-500',
    },
    {
      title: 'Page Views',
      value: '12,543',
      icon: Eye,
      trend: '▼ -2.4%',
      trendColor: 'text-rose-600 dark:text-rose-500',
    },
  ];

  // Mock sales data exactly matching mockup chart wave
  const salesData = [
    { date: 'Jan', Sales: 3200 },
    { date: 'Feb', Sales: 2800 },
    { date: 'Mar', Sales: 4500 },
    { date: 'Apr', Sales: 4100 },
    { date: 'May', Sales: 5200 },
    { date: 'Jun', Sales: 4800 },
    { date: 'Jul', Sales: 6400 },
  ];

  // Mock categories distribution matching mockup donut
  const categoryData = [
    { name: 'Audio', value: 35 },
    { name: 'Wearables', value: 25 },
    { name: 'Accessories', value: 20 },
    { name: 'Storage', value: 12 },
    { name: 'Other', value: 8 },
  ];

  // Sleek premium dark shades for the donut chart segments
  const COLORS = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];

  // Recent Orders matching mockup list
  const mockOrders = [
    { name: 'John Doe', email: 'john@example.com', price: 349, status: 'completed', initials: 'JD' },
    { name: 'Jane Smith', email: 'jane@example.com', price: 499, status: 'processing', initials: 'JS' },
    { name: 'Bob Wilson', email: 'bob@example.com', price: 129, status: 'pending', initials: 'BW' },
    { name: 'Alice Brown', email: 'alice@example.com', price: 199, status: 'completed', initials: 'AB' },
    { name: 'Charlie Davis', email: 'charlie@example.com', price: 79, status: 'shipped', initials: 'CD' },
  ];

  // Top Products matching mockup list
  const topProducts = [
    { name: 'Nova Pro Wireless Headphones', category: 'Audio', price: 349, sold: 2847 },
    { name: 'Ultra Smart Watch Series X', category: 'Wearables', price: 499, sold: 1923 },
    { name: 'Pro Laptop Stand Aluminum', category: 'Accessories', price: 129, sold: 856 },
    { name: 'Wireless Charging Pad Pro', category: 'Accessories', price: 79, sold: 1245 },
    { name: 'Studio Monitor Speakers', category: 'Audio', price: 599, sold: 423 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm border border-border/50 rounded-2xl bg-card">
            <CardContent className="p-6 space-y-3.5 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
                <stat.icon className="h-4.5 w-4.5 text-muted-foreground/60" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <span className={stat.trendColor}>{stat.trend}</span>
                  <span className="text-muted-foreground/75 font-semibold">vs last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue timeline Area Chart */}
        <Card className="lg:col-span-8 shadow-sm border border-border/50 rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/10">
              <h3 className="font-bold text-base text-foreground">Revenue Overview</h3>
              <div className="flex gap-1 bg-secondary/30 p-0.5 rounded-xl border border-border/30 text-[10px] font-bold">
                <button className="px-3 py-1 rounded-lg bg-card text-foreground shadow-sm">7D</button>
                <button className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground transition-all">30D</button>
                <button className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground transition-all">90D</button>
              </div>
            </div>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                  <XAxis dataKey="date" className="fill-muted-foreground font-semibold" axisLine={false} tickLine={false} />
                  <YAxis className="fill-muted-foreground font-semibold" axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '0.75rem',
                      color: 'var(--foreground)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Sales" 
                    stroke="#4f46e5" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category Donut Chart */}
        <Card className="lg:col-span-4 shadow-sm border border-border/50 rounded-2xl bg-card">
          <CardContent className="p-6">
            <h3 className="font-bold text-base text-foreground mb-6 pb-2 border-b border-border/10">Sales by Category</h3>
            <div className="h-56 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '0.75rem',
                      color: 'var(--foreground)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-[11px] font-bold text-muted-foreground/80">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders List */}
        <Card className="lg:col-span-7 shadow-sm border border-border/50 rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-border/10">
              <h3 className="font-bold text-base text-foreground">Recent Orders</h3>
              <a href="/admin/orderlist" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 transition-colors">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="space-y-4">
              {mockOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-border/10 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-foreground text-xs border border-border/30">
                      {order.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{order.name}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-extrabold text-foreground">${order.price}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider select-none ${
                      order.status === 'completed'
                        ? 'bg-blue-600 text-white'
                        : order.status === 'processing'
                        ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border border-sky-200/50'
                        : order.status === 'pending'
                        ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50'
                        : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products Rank List */}
        <Card className="lg:col-span-5 shadow-sm border border-border/50 rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-border/10">
              <h3 className="font-bold text-base text-foreground">Top Products</h3>
              <a href="/admin/productlist" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 transition-colors">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-border/10 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/25 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs shadow-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-foreground">${product.price}</p>
                    <p className="text-[10px] text-muted-foreground/80 font-bold">{product.sold.toLocaleString()} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardScreen;

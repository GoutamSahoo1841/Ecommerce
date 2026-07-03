import React from 'react';
import { useGetDashboardDataQuery } from '../../slices/ordersApiSlice';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DollarSign, ShoppingCart, Users, Sparkles } from 'lucide-react';

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

  // Formatting Sales Data for Line/Area Chart
  const salesData = data.salesData.map(item => ({
    date: item._id,
    Sales: item.totalSales,
  }));

  // Aggregating Product Data for Pie Chart
  const categoryCount = data.products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  
  const categoryData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  const COLORS = ['var(--primary)', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${data.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Total Orders',
      value: data.totalOrders,
      icon: ShoppingCart,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: 'Total Users',
      value: data.totalUsers,
      icon: Users,
      color: 'bg-indigo-500/10 text-indigo-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time store overview and metrics</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl shrink-0 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-black text-foreground mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Containers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-8 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Revenue Timeline
            </h2>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="date" className="fill-muted-foreground font-semibold" />
                  <YAxis className="fill-muted-foreground font-semibold" />
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
                    stroke="var(--primary)" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Categories Distribution Chart */}
        <Card className="lg:col-span-4 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-bold text-foreground">Sales by Category</h2>
            <div className="h-80 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardScreen;

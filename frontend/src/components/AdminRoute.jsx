import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Home
} from 'lucide-react';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Products', href: '/admin/productlist' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orderlist' },
    { icon: Users, label: 'Customers', href: '/admin/userlist' },
    { icon: Settings, label: 'Settings', href: '/profile' },
  ];

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border/50 bg-card shrink-0 p-6 lg:space-y-8">
          <div className="flex h-8 items-center justify-between">
            <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              NOVA Admin
            </Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold">
              <Home className="h-3 w-3" />
              Store
            </Link>
          </div>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide mt-4 lg:mt-0">
            {sidebarItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm/5'
                      : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content scroll window */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminRoute;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  MessageSquare,
  Command,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useGetProductCategoriesQuery } from '../slices/productsApiSlice';
import SearchModal from './SearchModal';
import { CartPreview } from './CartPreview';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/deals', label: 'Deals' },
];

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categoriesHover, setCategoriesHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [logoutApiCall] = useLogoutMutation();
  const { data: categories } = useGetProductCategoriesQuery();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchModalOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass shadow-sm py-2' : 'bg-background/80 backdrop-blur-md py-3 border-b border-border/40'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between gap-4">
            {/* Logo or Admin Header */}
            <div className="flex items-center gap-2">
              {pathname.startsWith('/admin') ? (
                <span className="text-xl font-bold tracking-tight text-foreground select-none">
                  {pathname.startsWith('/admin/dashboard')
                    ? 'Admin Dashboard'
                    : pathname.startsWith('/admin/productlist')
                    ? 'Products Management'
                    : pathname.startsWith('/admin/orderlist')
                    ? 'Orders Management'
                    : pathname.startsWith('/admin/userlist')
                    ? 'Users Management'
                    : pathname.startsWith('/admin/chat')
                    ? 'Live Chat Support'
                    : 'Admin Portal'}
                </span>
              ) : (
                <Link to="/" className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xl font-bold tracking-tight text-foreground"
                  >
                    ShopSphere
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Desktop Nav */}
            {!pathname.startsWith('/admin') && (
              <nav className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => {
                  const isActive =
                    (link.to === '/' && pathname === '/') ||
                    (link.to === '/search' && (pathname.startsWith('/search') || pathname.startsWith('/product'))) ||
                    (link.to === '/categories' && pathname.startsWith('/categories')) ||
                    (link.to === '/deals' && pathname.startsWith('/deals'));

                  return (
                    <Link key={link.to} to={link.to}>
                      <motion.div
                        className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                          isActive ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {link.label}
                        {isActive && (
                          <motion.div
                            className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary"
                            layoutId="nav-indicator"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1">
              {pathname.startsWith('/admin') ? (
                <Link to="/">
                  <Button variant="outline" size="sm" className="rounded-full">
                    View Storefront
                  </Button>
                </Link>
              ) : (
                <>
                  {/* Search Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchModalOpen(true)}
                    className="relative"
                  >
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                    <kbd className="pointer-events-none absolute -bottom-1 right-0 hidden rounded border border-border bg-muted px-1 text-[10px] font-medium text-muted-foreground sm:block font-mono">
                      ⌘K
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
                  <Link to="/wishlist">
                    <Button variant="ghost" size="icon" className="relative">
                      <Heart className="h-5 w-5" />
                      {wishlistCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                        >
                          {wishlistCount}
                        </motion.span>
                      )}
                      <span className="sr-only">Wishlist</span>
                    </Button>
                  </Link>

                  {/* Cart Drawer Trigger */}
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

                  {/* User Dropdown / Auth Link */}
                  {userInfo ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full">
                          <User className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{userInfo.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                        {userInfo.isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">Admin</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                              Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/admin/productlist')}>
                              <Package className="mr-2 h-4 w-4 text-primary" />
                              Products
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/admin/orderlist')}>
                              <ShoppingCart className="mr-2 h-4 w-4 text-primary" />
                              Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/admin/userlist')}>
                              <Users className="mr-2 h-4 w-4 text-primary" />
                              Users
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/admin/chat')}>
                              <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                              Live Chat
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logoutHandler} className="text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link to="/login" className="hidden sm:block">
                      <Button size="sm">Sign In</Button>
                    </Link>
                  )}

                  {/* Mobile Menu Sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                      <nav className="mt-8 flex flex-col gap-4">
                        {navLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`text-lg font-medium transition-colors ${
                              pathname === link.to ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                        {userInfo ? (
                          <>
                            <Link
                              to="/profile"
                              className="text-lg font-medium text-muted-foreground hover:text-foreground"
                            >
                              Profile ({userInfo.name})
                            </Link>
                            {userInfo.isAdmin && (
                              <Link
                                to="/admin/dashboard"
                                className="text-lg font-semibold text-primary"
                              >
                                Admin Dashboard
                              </Link>
                            )}
                            <button
                              onClick={logoutHandler}
                              className="text-lg font-medium text-destructive text-left"
                            >
                              Log out
                            </button>
                          </>
                        ) : (
                          <Link to="/login" className="text-lg font-semibold text-primary">
                            Sign In / Register
                          </Link>
                        )}
                      </nav>
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Cart Preview Drawer */}
      <CartPreview open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;

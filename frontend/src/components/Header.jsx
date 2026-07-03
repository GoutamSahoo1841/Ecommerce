import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useGetProductCategoriesQuery } from '../slices/productsApiSlice';
import SearchModal from './SearchModal';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  MessageSquare,
  Search
} from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [categoriesHover, setCategoriesHover] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [logoutApiCall] = useLogoutMutation();
  const { data: categories } = useGetProductCategoriesQuery();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Global Ctrl+K / Cmd+K search shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setDropdownOpen(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/deals', label: 'Deals' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-border/40 py-2.5' : 'bg-background/80 backdrop-blur-md py-4 border-b border-border/40'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            {/* Left side: Logo */}
            <div className="flex-1 md:flex-initial">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-foreground transition-colors hover:text-primary">
                  NOVA
                </span>
              </Link>
            </div>

            {/* Middle section: Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                // Determine active status
                const isActive = (link.to === '/' && pathname === '/') ||
                  (link.to === '/search' && (pathname.startsWith('/search') || pathname.startsWith('/product'))) ||
                  (link.to === '/categories' && pathname.startsWith('/categories')) ||
                  (link.to === '/deals' && pathname.startsWith('/deals'));

                if (link.label === 'Categories') {
                  return (
                    <div 
                      key={link.to}
                      className="relative"
                      onMouseEnter={() => setCategoriesHover(true)}
                      onMouseLeave={() => setCategoriesHover(false)}
                    >
                      <Link
                        to={link.to}
                        className={`relative px-4 py-2 text-sm transition-all duration-200 flex items-center gap-1.5 ${
                          isActive 
                            ? 'text-foreground font-semibold' 
                            : 'text-muted-foreground hover:text-foreground font-medium'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${categoriesHover ? 'rotate-180' : ''}`} />
                        {isActive && (
                          <motion.div
                            layoutId="nav-indicator"
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {categoriesHover && categories && categories.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 mt-1 w-48 rounded-xl bg-card border border-border shadow-xl py-2 z-50 overflow-hidden"
                          >
                            {categories.map((c) => (
                              <Link
                                key={c}
                                to={`/search?category=${c}`}
                                className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors capitalize font-medium"
                                onClick={() => setCategoriesHover(false)}
                              >
                                {c}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link 
                    key={link.to} 
                    to={link.to}
                    className={`relative px-4 py-2 text-sm transition-all duration-200 ${
                      isActive 
                        ? 'text-foreground font-semibold' 
                        : 'text-muted-foreground hover:text-foreground font-medium'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: Actions */}
            <div className="flex-1 md:flex-initial flex items-center justify-end gap-1.5">
              
              {/* Search button with keyboard shortcut */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchModalOpen(true)}
                className="relative text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/60 h-9 w-9"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
                <kbd className="pointer-events-none absolute -bottom-1 -right-0.5 hidden rounded border border-border bg-muted/90 px-1 text-[8px] font-medium text-muted-foreground sm:block font-mono">
                  ⌘K
                </kbd>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/60 h-9 w-9"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Wishlist */}
              <Link to="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/60 h-9 w-9"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistItems && wishlistItems.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/60 h-9 w-9"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/60 h-9 w-9"
                >
                  <User className="h-5 w-5" />
                </Button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 bg-card rounded-xl shadow-xl py-2 border border-border z-50 overflow-hidden"
                    >
                      {userInfo ? (
                        <>
                          <div className="px-4 py-2.5 border-b border-border/50 bg-secondary/10">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Logged in as</span>
                            <span className="text-sm font-semibold text-foreground block truncate mt-0.5">{userInfo.name}</span>
                          </div>
                          <Link
                            to="/profile"
                            className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                            onClick={() => setDropdownOpen(false)}
                          >
                            My Profile
                          </Link>
                          {userInfo.isAdmin && (
                            <>
                              <div className="border-t border-border/50 my-1"></div>
                              <div className="px-4 py-1.5 text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5">Admin Controls</div>
                              <Link
                                to="/admin/dashboard"
                                className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                                onClick={() => setDropdownOpen(false)}
                              >
                                Dashboard
                              </Link>
                              <Link
                                to="/admin/productlist"
                                className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                                onClick={() => setDropdownOpen(false)}
                              >
                                Products
                              </Link>
                              <Link
                                to="/admin/userlist"
                                className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                                onClick={() => setDropdownOpen(false)}
                              >
                                Users
                              </Link>
                              <Link
                                to="/admin/orderlist"
                                className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                                onClick={() => setDropdownOpen(false)}
                              >
                                Orders
                              </Link>
                              <Link
                                to="/admin/chat"
                                className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                                onClick={() => setDropdownOpen(false)}
                              >
                                Live Chat
                              </Link>
                            </>
                          )}
                          <div className="border-t border-border/50 my-1"></div>
                          <button
                            onClick={logoutHandler}
                            className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 font-medium"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Register
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-muted-foreground hover:text-foreground rounded-full ml-1 h-9 w-9 hover:bg-secondary/60"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border/50 py-4 px-6 shadow-xl overflow-hidden"
            >
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className="text-base font-semibold text-muted-foreground hover:text-foreground py-2 border-b border-border/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link 
                  to="/cart" 
                  className="text-base font-semibold text-muted-foreground hover:text-foreground py-2 border-b border-border/10 flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Shopping Cart</span>
                  <span className="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold">{cartCount}</span>
                </Link>
                <Link 
                  to="/wishlist" 
                  className="text-base font-semibold text-muted-foreground hover:text-foreground py-2 border-b border-border/10 flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>My Wishlist</span>
                  <span className="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold">{wishlistItems.length}</span>
                </Link>
                {userInfo ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="text-base font-semibold text-muted-foreground hover:text-foreground py-2 border-b border-border/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile ({userInfo.name})
                    </Link>
                    {userInfo.isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        className="text-base font-semibold text-primary py-2 border-b border-border/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logoutHandler();
                        setMobileMenuOpen(false);
                      }}
                      className="text-base font-semibold text-destructive py-2 text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-base font-semibold text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In / Register
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spotlight Command Search Modal */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </>
  );
};

export default Header;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, Heart, ShoppingCart, User, ArrowRight, Tag, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetProductsQuery, useGetProductCategoriesQuery } from '../slices/productsApiSlice';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  // Fetch categories
  const { data: categories } = useGetProductCategoriesQuery();
  
  // Fetch matching products based on search term
  const { data, isLoading } = useGetProductsQuery(
    { keyword: searchTerm },
    { skip: !searchTerm.trim() }
  );
  
  const products = data?.products || [];

  // Focus on input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl mx-4"
        >
          {/* Search Header */}
          <div className="flex items-center border-b border-border px-4 py-3.5">
            <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, categories, pages..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full hover:bg-secondary text-muted-foreground transition-colors mr-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground h-5">
              ESC
            </kbd>
          </div>

          {/* Search Content */}
          <div className="max-h-[380px] overflow-y-auto p-4 space-y-5">
            {/* Loading Indicator */}
            {searchTerm && isLoading && (
              <div className="flex items-center justify-center py-8 gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Searching store database...</span>
              </div>
            )}

            {/* Live Search Results */}
            {searchTerm && !isLoading && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  Matching Products
                </h3>
                {products.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-1">
                    <HelpCircle className="h-5 w-5 text-muted-foreground/50" />
                    <span>No products match "{searchTerm}"</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {products.slice(0, 5).map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleNavigate(`/product/${product._id}`)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-secondary text-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary overflow-hidden border border-border/50">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.category} · <span className="font-semibold text-foreground">${product.price}</span>
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions / Categories (Shown when search is empty) */}
            {!searchTerm && (
              <>
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    Quick Links
                  </h3>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { label: 'Home Page', path: '/', icon: Package },
                      { label: 'All Products', path: '/search', icon: Search },
                      { label: 'Shopping Cart', path: '/cart', icon: ShoppingCart },
                      { label: 'My Wishlist', path: '/wishlist', icon: Heart },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigate(item.path)}
                        className="flex items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-secondary text-sm"
                      >
                        <item.icon className="h-4.5 w-4.5 text-muted-foreground" />
                        <span className="font-medium text-foreground">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {categories && categories.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 flex items-center justify-between">
                      <span>Browse Categories</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleNavigate(`/search?category=${c}`)}
                          className="flex items-center gap-1.5 rounded-full bg-secondary hover:bg-primary hover:text-white px-3 py-1.5 text-xs text-foreground font-medium transition-colors capitalize"
                        >
                          <Tag className="h-3 w-3 shrink-0" />
                          <span>{c}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-border bg-secondary/30 px-4 py-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-card px-1 font-mono">Enter</kbd> to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-card px-1 font-mono">Esc</kbd> to close
              </span>
            </div>
            <span>NOVA Spotlight Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;

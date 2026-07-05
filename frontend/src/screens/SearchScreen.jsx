import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Search, 
  Loader2, 
  Star, 
  Trash2, 
  SlidersHorizontal, 
  AlertCircle,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import { useGetProductsQuery, useGetProductCategoriesQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const SearchScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const keyword = searchParams.get('keyword') || '';
  const pageNumber = searchParams.get('pageNumber') || '1';
  const category = searchParams.get('category') || 'all';
  const price = searchParams.get('price') || 'all';
  const rating = searchParams.get('rating') || 'all';
  const sort = searchParams.get('sort') || 'featured';

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
    price,
    rating,
    sort,
  });

  // Fetch all products dynamically to calculate counts across categories
  const { data: allProductsData } = useGetProductsQuery({});
  const allProducts = allProductsData?.products || [];

  const { data: categories, isLoading: loadingCategories } = useGetProductCategoriesQuery();

  const { userInfo } = useSelector((state) => state.auth);

  const [viewMode, setViewMode] = useState('grid');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterKeyword = filter.keyword || keyword;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const filterSort = filter.sort || sort;
    
    return `/search?category=${filterCategory}&keyword=${filterKeyword}&price=${filterPrice}&rating=${filterRating}&sort=${filterSort}&pageNumber=${filterPage}`;
  };

  const handleAddToCart = (p) => {
    if (!userInfo) {
      toast.info('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success(`Added ${p.name} to cart`);
  };

  const categoryCounts = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts]);

  const hasActiveFilters = keyword !== '' || category !== 'all' || rating !== 'all' || price !== 'all';

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
    { label: 'Rating', value: 'rating' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">All Products</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isLoading ? 'Loading products...' : `${data?.count || 0} products`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 bg-card rounded-[24px] shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-foreground" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
                  >
                    <Link to="/search">
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear All
                    </Link>
                  </Button>
                )}
              </div>

              {/* Categories Checkbox List */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground">Categories</h4>
                {loadingCategories ? (
                  <div className="space-y-2 py-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse bg-muted/30 h-6 rounded-lg w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories?.map((c) => (
                      <label key={c} className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground cursor-pointer py-0.5">
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={category === c}
                            onChange={() => {
                              const newCategory = category === c ? 'all' : c;
                              navigate(getFilterUrl({ category: newCategory, page: 1 }));
                            }}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/25 cursor-pointer accent-primary" 
                          />
                          <span className={`capitalize font-semibold text-xs sm:text-sm ${category === c ? 'text-foreground' : ''}`}>{c}</span>
                        </div>
                        <span className="text-xs text-muted-foreground/60 font-bold">{categoryCounts[c] || 0}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Slider */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <h4 className="text-sm font-bold text-foreground">Price Range</h4>
                <div className="pt-2">
                  <input 
                    type="range"
                    min="0"
                    max="600"
                    value={price === 'all' ? 600 : Number(price.split('-')[1]) || 600}
                    onChange={(e) => {
                      const maxVal = e.target.value;
                      navigate(getFilterUrl({ price: `0-${maxVal}`, page: 1 }));
                    }}
                    className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-semibold mt-2.5">
                    <span>$0</span>
                    <span>${price === 'all' ? '600' : price.split('-')[1]}</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Products Results List */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-24 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse text-sm">Searching store database...</p>
            </div>
          ) : error ? (
            <Card className="border-destructive/30 bg-destructive/10">
              <CardContent className="flex items-center gap-3 p-6 text-destructive-foreground">
                <span className="font-semibold text-sm">Error:</span>
                <span className="text-sm">{error?.data?.message || error.error}</span>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Controls Bar */}
              <div className="flex justify-between items-center bg-transparent py-1">
                <div>
                  {keyword !== '' && (
                    <span className="text-sm text-muted-foreground">
                      Results for &quot;<span className="text-foreground font-bold">{keyword}</span>&quot;
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Grid/List layout toggle */}
                  <div className="flex items-center bg-secondary/50 rounded-xl p-0.5 border border-border/30">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                      title="Grid View"
                    >
                      <LayoutGrid className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                      title="List View"
                    >
                      <ListIcon className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Sort dropdown */}
                  <div className="relative" ref={sortRef}>
                    <Button
                      variant="outline"
                      onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="h-10 rounded-xl px-4 text-xs font-semibold flex items-center gap-1.5 bg-background shadow-xs hover:bg-secondary/40"
                    >
                      Sort
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    {sortDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-lg py-1.5 z-30 overflow-hidden">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              navigate(getFilterUrl({ sort: opt.value, page: 1 }));
                              setSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                              sort === opt.value ? 'bg-primary/5 text-primary font-bold' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* No Results Screen */}
              {data.products.length === 0 && (
                <Card className="border-border/50 bg-card py-16 text-center rounded-[24px]">
                  <CardContent className="space-y-4 max-w-sm mx-auto">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">No Products Found</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        We couldn&apos;t find any items matching your selection. Try adjustments or clear filters.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl shadow-md text-white">
                      <Link to="/search">Clear Filters</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Products Catalog Display */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.products.map((p, idx) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <Product product={p} index={idx} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {data.products.map((p, idx) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <Card className="overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300 relative group border border-border/50 rounded-2xl flex flex-col sm:flex-row h-auto sm:h-[180px] bg-card">
                        {/* Image */}
                        <div className="relative w-full sm:w-[180px] aspect-square sm:aspect-auto sm:h-full overflow-hidden bg-secondary/30 shrink-0">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                          />
                          {p.badge && (
                            <span className={`absolute left-3 top-3 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white ${
                              p.badge.toLowerCase() === 'sale' ? 'bg-rose-500' :
                              p.badge.toLowerCase() === 'new' ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}>
                              {p.badge}
                            </span>
                          )}
                        </div>

                        {/* Content details */}
                        <div className="p-5 flex flex-col justify-between flex-grow">
                          <div className="space-y-1 text-left">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{p.category}</span>
                                <Link to={`/product/${p._id}`}>
                                  <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                                    {p.name}
                                  </h3>
                                </Link>
                              </div>
                              <span className="text-lg font-extrabold text-foreground">${p.price}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 max-w-xl leading-relaxed mt-1">
                              {p.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-border/30 pt-3 mt-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-semibold text-foreground">{p.rating}</span>
                              <span className="text-xs text-muted-foreground">({p.numReviews})</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Button 
                                onClick={() => handleAddToCart(p)}
                                disabled={p.countInStock === 0}
                                size="sm"
                                className="rounded-xl text-xs h-8 text-white px-4 font-semibold"
                              >
                                <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                                {p.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex justify-center pt-8">
                  <div className="flex gap-2">
                    {[...Array(data.pages).keys()].map((x) => {
                      const pageVal = x + 1;
                      const isActive = Number(pageNumber) === pageVal;
                      return (
                        <Button
                          key={pageVal}
                          variant={isActive ? 'default' : 'outline'}
                          size="icon"
                          asChild
                          className="h-10 w-10 font-bold rounded-xl"
                        >
                          <Link to={getFilterUrl({ page: pageVal })}>
                            {pageVal}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default SearchScreen;

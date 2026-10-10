import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useGetProductsQuery, useGetProductCategoriesQuery } from '../slices/productsApiSlice';
import { addToCart, enableBuyNow } from '../slices/cartSlice';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { toast } from 'react-toastify';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
  { label: 'Rating', value: 'rating' },
];

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

  const [viewMode, setViewMode] = useState('grid');
  const [priceSliderVal, setPriceSliderVal] = useState([0, 1000]);

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
    price,
    rating,
    sort,
  });

  const { data: allProductsData } = useGetProductsQuery({});
  const allProducts = allProductsData?.products || [];
  const { data: categories, isLoading: loadingCategories } = useGetProductCategoriesQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category !== undefined ? filter.category : category;
    const filterKeyword = filter.keyword !== undefined ? filter.keyword : keyword;
    const filterRating = filter.rating !== undefined ? filter.rating : rating;
    const filterPrice = filter.price !== undefined ? filter.price : price;
    const filterSort = filter.sort !== undefined ? filter.sort : sort;

    return `/search?category=${encodeURIComponent(filterCategory)}&keyword=${encodeURIComponent(filterKeyword)}&price=${filterPrice}&rating=${filterRating}&sort=${filterSort}&pageNumber=${filterPage}`;
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

  const handleClearFilters = () => {
    navigate('/search');
  };

  const FilterContent = () => (
    <div className="space-y-6 text-left">
      {/* Categories Filter */}
      <div>
        <h3 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wider">Categories</h3>
        {loadingCategories ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categories?.map((c) => (
              <label key={c} className="flex cursor-pointer items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={category === c}
                    onCheckedChange={() => {
                      const newCategory = category === c ? 'all' : c;
                      navigate(getFilterUrl({ category: newCategory, page: 1 }));
                    }}
                  />
                  <span className={`capitalize text-sm ${category === c ? 'font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    {c}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{categoryCounts[c] || 0}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Slider */}
      <div>
        <h3 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wider">Max Price</h3>
        <Slider
          value={priceSliderVal}
          onValueChange={(val) => setPriceSliderVal(val)}
          onValueCommit={(val) => {
            navigate(getFilterUrl({ price: `0-${val[1]}`, page: 1 }));
          }}
          min={0}
          max={1000}
          step={10}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
          <span>₹0</span>
          <span>₹{priceSliderVal[1].toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={handleClearFilters} className="w-full">
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-4 text-left">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            {keyword ? `Search Results for "${keyword}"` : 'All Products'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isLoading ? 'Searching...' : `${data?.count || 0} products found`}
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <motion.aside
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="hidden w-64 shrink-0 lg:block"
          >
            <div className="sticky top-24 rounded-2xl bg-card p-6 shadow-sm border border-border/50">
              <h2 className="mb-6 flex items-center gap-2 font-semibold text-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h2>
              <FilterContent />
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Toolbar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm"
            >
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Active Category Badge */}
                {category !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer gap-1 pr-1 capitalize"
                    onClick={() => navigate(getFilterUrl({ category: 'all', page: 1 }))}
                  >
                    Category: {category}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {keyword && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer gap-1 pr-1"
                    onClick={() => navigate(getFilterUrl({ keyword: '', page: 1 }))}
                  >
                    Query: {keyword}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode */}
                <div className="hidden items-center gap-1 rounded-lg bg-muted p-1 sm:flex">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('compact')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Sort: {sortOptions.find((o) => o.value === sort)?.label || 'Featured'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => navigate(getFilterUrl({ sort: option.value, page: 1 }))}
                        className={sort === option.value ? 'bg-accent font-semibold' : ''}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Products Grid */}
            {isLoading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'sm:grid-cols-2 xl:grid-cols-3'
                    : 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
                {error?.data?.message || error.error || 'Error loading products'}
              </div>
            ) : !data?.products || data.products.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-2xl border border-border/50"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No products found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search keywords
                </p>
                <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'sm:grid-cols-2 xl:grid-cols-3'
                    : 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {data.products.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {data?.pages > 1 && (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;

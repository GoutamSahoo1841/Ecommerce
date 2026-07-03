import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Loader2, 
  Star, 
  Trash2, 
  SlidersHorizontal, 
  Layers, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import { useGetProductsQuery, useGetProductCategoriesQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const SearchScreen = () => {
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const pageNumber = searchParams.get('pageNumber') || '1';
  const category = searchParams.get('category') || 'all';
  const price = searchParams.get('price') || 'all';
  const rating = searchParams.get('rating') || 'all';

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
    price,
    rating,
  });

  const { data: categories, isLoading: loadingCategories, error: errorCategories } = useGetProductCategoriesQuery();

  const prices = [
    { name: '$1 to $50', value: '1-50' },
    { name: '$51 to $200', value: '51-200' },
    { name: '$201 to $1000', value: '201-1000' },
  ];

  const ratings = [
    { name: '4 Stars & Up', rating: 4 },
    { name: '3 Stars & Up', rating: 3 },
    { name: '2 Stars & Up', rating: 2 },
    { name: '1 Star & Up', rating: 1 },
  ];

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterKeyword = filter.keyword || keyword;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    
    return `/search?category=${filterCategory}&keyword=${filterKeyword}&price=${filterPrice}&rating=${filterRating}&pageNumber=${filterPage}`;
  };

  const hasActiveFilters = keyword !== '' || category !== 'all' || rating !== 'all' || price !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Search className="h-8 w-8 text-primary" />
          Search Products
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse through our modern catalog using filters to pinpoint your needs
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <Card className="border-border/50 bg-card/30 backdrop-blur-md">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
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

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Categories
                </h4>
                {loadingCategories ? (
                  <div className="space-y-2 py-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse bg-muted/30 h-6 rounded-lg w-full" />
                    ))}
                  </div>
                ) : errorCategories ? (
                  <div className="text-xs text-destructive">{errorCategories?.data?.message || errorCategories.error}</div>
                ) : (
                  <ul className="space-y-1">
                    <li>
                      <Link 
                        to={getFilterUrl({ category: 'all', page: 1 })}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-all ${
                          category === 'all' 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                      >
                        Any Category
                      </Link>
                    </li>
                    {categories?.map((c) => (
                      <li key={c}>
                        <Link 
                          to={getFilterUrl({ category: c, page: 1 })}
                          className={`block px-3 py-1.5 rounded-lg text-sm transition-all capitalize ${
                            category === c 
                              ? 'bg-primary/10 text-primary font-semibold' 
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          }`}
                        >
                          {c}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Price */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  Price Range
                </h4>
                <ul className="space-y-1">
                  <li>
                    <Link 
                      to={getFilterUrl({ price: 'all', page: 1 })}
                      className={`block px-3 py-1.5 rounded-lg text-sm transition-all ${
                        price === 'all' 
                          ? 'bg-primary/10 text-primary font-semibold' 
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      Any Price
                    </Link>
                  </li>
                  {prices.map((p) => (
                    <li key={p.value}>
                      <Link 
                        to={getFilterUrl({ price: p.value, page: 1 })}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-all ${
                          price === p.value 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rating */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5" />
                  Avg. Reviews
                </h4>
                <ul className="space-y-1">
                  <li>
                    <Link 
                      to={getFilterUrl({ rating: 'all', page: 1 })}
                      className={`block px-3 py-1.5 rounded-lg text-sm transition-all ${
                        rating === 'all' 
                          ? 'bg-primary/10 text-primary font-semibold' 
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      Any Rating
                    </Link>
                  </li>
                  {ratings.map((r) => (
                    <li key={r.rating}>
                      <Link 
                        to={getFilterUrl({ rating: r.rating, page: 1 })}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-all ${
                          Number(rating) === r.rating 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {[...Array(5).keys()].map((starIdx) => (
                            <Star
                              key={starIdx}
                              className={`h-3.5 w-3.5 ${
                                starIdx < r.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-muted-foreground/20'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-xs text-muted-foreground group-hover:text-foreground">& Up</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Products Results List */}
        <div className="flex-1 space-y-6">
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
              {/* Info Bar */}
              <div className="flex justify-between items-center bg-card/10 border border-border/40 px-5 py-3 rounded-2xl text-sm text-muted-foreground backdrop-blur-sm">
                <div>
                  <span className="font-semibold text-foreground mr-1">
                    {data.count === 0 ? 'No' : data.count}
                  </span>
                  results
                  {keyword !== '' && (
                    <> for &quot;<span className="text-foreground font-semibold">{keyword}</span>&quot;</>
                  )}
                  {category !== 'all' && (
                    <> in <span className="text-foreground capitalize font-semibold">{category}</span></>
                  )}
                  {price !== 'all' && (
                    <> matching price <span className="text-foreground font-semibold">${price}</span></>
                  )}
                  {rating !== 'all' && (
                    <> with <span className="text-foreground font-semibold">{rating}+ stars</span></>
                  )}
                </div>
              </div>

              {/* No Results Screen */}
              {data.products.length === 0 && (
                <Card className="border-border/50 bg-card/20 backdrop-blur-md py-16 text-center">
                  <CardContent className="space-y-4 max-w-sm mx-auto">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">No Products Found</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        We couldn&apos;t find any items matching your exact selection. Try adjustments or clear filters.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl shadow-md">
                      <Link to="/search">Clear Filters</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.products.map((p, idx) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <Product product={p} />
                  </motion.div>
                ))}
              </div>

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
                          className="h-10 w-10 font-bold"
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

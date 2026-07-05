import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGetProductCategoriesQuery, useGetProductsQuery } from '../slices/productsApiSlice';
import Meta from '../components/Meta';

const categoryMeta = {
  audio: {
    name: 'Audio',
    image: '/images/category-audio.png',
  },
  wearables: {
    name: 'Wearables',
    image: '/images/category-wearables.png',
  },
  accessories: {
    name: 'Accessories',
    image: '/images/category-accessories.png',
  },
  storage: {
    name: 'Storage',
    image: '/images/category-storage.png',
  },
  'smart home': {
    name: 'Smart Home',
    image: '/images/category-audio.png',
  },
  gaming: {
    name: 'Gaming',
    image: '/images/category-gaming.png',
  },
};

const CategoriesScreen = () => {
  const { data: categories, isLoading, error } = useGetProductCategoriesQuery();
  const { data: allProductsData } = useGetProductsQuery({});
  const allProducts = allProductsData?.products || [];

  const categoryCounts = React.useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts]);

  return (
    <div className="space-y-8">
      <Meta title="Shop by Category - NOVA" description="Browse premium products across various categories." />
      
      {/* Title Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Shop by Category</h1>
        <p className="text-muted-foreground text-sm">
          Find exactly what you're looking for
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[280px] rounded-3xl bg-card border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl border border-destructive/20 text-sm">
          {error?.data?.message || error.error || 'Failed to load categories'}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mt-10">
          {categories?.map((category, idx) => {
            const meta = categoryMeta[category.toLowerCase()] || {
              name: category,
              image: '/images/category-accessories.png',
            };

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={`/search?category=${category}`}
                  className="group relative flex flex-col h-[280px] overflow-hidden rounded-3xl border border-border/40 shadow-xs hover:shadow-md transition-all duration-500 bg-card"
                >
                  {/* Category Image Cover */}
                  <img 
                    src={meta.image} 
                    alt={category} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent transition-opacity duration-300" />

                  {/* Text Details Overlaid at Bottom Left */}
                  <div className="absolute bottom-6 left-6 z-10 flex flex-col space-y-1 text-left">
                    <h3 className="text-xl font-extrabold text-foreground capitalize tracking-tight">
                      {meta.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {categoryCounts[category] || 0} products
                    </p>
                    <span className="text-primary hover:underline text-xs sm:text-sm font-extrabold flex items-center gap-1.5 pt-2 group-hover:gap-2 transition-all duration-300">
                      Shop Now
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesScreen;

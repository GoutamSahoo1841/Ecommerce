import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [products]);

  if (isLoading) {
    return (
      <div className="w-full rounded-3xl h-[300px] md:h-[400px] bg-card border border-border/50 animate-pulse flex items-center justify-center text-muted-foreground text-sm">
        Loading Featured Collection...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-2xl border border-destructive/20 mb-8 text-sm">
        {error?.data?.message || error.error || 'An error occurred loading top products'}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary/30 border border-border/50 shadow-lg mb-12 h-[350px] md:h-[450px]">
      {/* Background radial highlights */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full grid md:grid-cols-2 items-center p-8 md:p-12 lg:p-16 gap-8"
        >
          {/* Left Text details */}
          <div className="flex flex-col items-start justify-center text-left">
            <Badge variant="secondary" className="mb-4 flex items-center gap-1 bg-primary/10 text-primary border-none py-1">
              <Sparkles className="h-3 w-3" />
              Featured Offer
            </Badge>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight line-clamp-2 leading-tight">
              {currentProduct.name}
            </h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base line-clamp-2 max-w-md">
              {currentProduct.description}
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">${currentProduct.price}</span>
              {currentProduct.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${currentProduct.originalPrice}</span>
              )}
            </div>
            <div className="mt-6">
              <Button size="lg" asChild className="rounded-xl shadow-md">
                <Link to={`/product/${currentProduct._id}`} className="flex items-center gap-1 text-white">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Product Image showcase */}
          <div className="hidden md:flex justify-center items-center relative h-full">
            <motion.div
              initial={{ scale: 0.9, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square max-w-[280px] lg:max-w-[320px] w-full overflow-hidden rounded-2xl bg-secondary/20 shadow-md group-hover:shadow-xl transition-all"
            >
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-cover select-none"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Indicators */}
      <div className="absolute bottom-6 left-8 md:left-12 lg:left-16 z-20 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;

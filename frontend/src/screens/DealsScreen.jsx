import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Meta from '../components/Meta';

const DealsScreen = () => {
  // Query only deals
  const { data, isLoading, error } = useGetProductsQuery({ deals: 'true' });
  const products = data?.products || [];

  return (
    <div className="space-y-8">
      <Meta title="Special Deals - NOVA" description="Shop limited time discount offers and tech deals." />

      {/* Centered Hero promo banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-purple-50/30 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950/20 p-8 md:p-14 text-center border border-border/30 shadow-xs flex flex-col items-center justify-center">
        <span className="inline-flex items-center bg-blue-500/10 dark:bg-blue-500/20 text-primary dark:text-blue-400 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide">
          Limited Time Offers
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mt-4">
          Special Deals
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-xl mt-3.5 leading-relaxed">
          Save big on our best-selling products. These exclusive offers won't last long, so grab your favorites before they're gone!
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
          <p className="text-muted-foreground animate-pulse text-sm">Loading exclusive offers...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl border border-destructive/20 text-sm">
          {error?.data?.message || error.error || 'Failed to load deals'}
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-2 border border-border/40 rounded-2xl bg-card">
              <HelpCircle className="h-8 w-8 text-muted-foreground/45" />
              <p>No active deals available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <Product key={product._id} product={product} index={idx} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DealsScreen;

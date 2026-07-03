import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Percent, Timer, HelpCircle, Loader2 } from 'lucide-react';
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

      {/* Hero promo banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent p-8 md:p-12 border border-border/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-semibold">
            <Percent className="h-3.5 w-3.5" />
            Limited Time Offers
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Special Deals
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
            Save big on our best-selling products. These exclusive offers won't last long, so grab your favorites before they're gone!
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border/40 w-fit px-3 py-1.5 rounded-xl font-medium">
            <Timer className="h-3.5 w-3.5 text-rose-500" />
            <span>Offers valid while stock lasts</span>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block select-none pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--color-destructive)_0,transparent_100%)] blur-2xl" />
        </div>
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

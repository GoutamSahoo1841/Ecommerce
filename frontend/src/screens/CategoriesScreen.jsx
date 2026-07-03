import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  Watch, 
  Keyboard, 
  HardDrive, 
  Home, 
  Gamepad,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useGetProductCategoriesQuery } from '../slices/productsApiSlice';
import Meta from '../components/Meta';

const categoryMeta = {
  audio: {
    name: 'Audio',
    icon: Headphones,
    description: 'Immersive sound with premium headphones, earbuds, and studio monitors.',
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    borderColor: 'group-hover:border-blue-500/50',
    iconBg: 'bg-blue-500/10 text-blue-500',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aec44eb5b1?w=800&q=80',
  },
  wearables: {
    name: 'Wearables',
    icon: Watch,
    description: 'Smart watches and fitness trackers built for health and productivity.',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    borderColor: 'group-hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80',
  },
  accessories: {
    name: 'Accessories',
    icon: Keyboard,
    description: 'Mechanical keyboards, laptop stands, webcams, and USB-C hubs.',
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    borderColor: 'group-hover:border-amber-500/50',
    iconBg: 'bg-amber-500/10 text-amber-500',
    image: 'https://images.unsplash.com/photo-1527814050087-179f012248ce?w=800&q=80',
  },
  storage: {
    name: 'Storage',
    icon: HardDrive,
    description: 'High-speed portable SSDs and high-capacity secure flash memory.',
    gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
    borderColor: 'group-hover:border-purple-500/50',
    iconBg: 'bg-purple-500/10 text-purple-500',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80',
  },
  'smart home': {
    name: 'Smart Home',
    icon: Home,
    description: 'Central control systems, speakers, and smart devices for modern homes.',
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    borderColor: 'group-hover:border-rose-500/50',
    iconBg: 'bg-rose-500/10 text-rose-500',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
  },
  gaming: {
    name: 'Gaming',
    icon: Gamepad,
    description: 'High-precision gaming gear including mice, keypads, and control decks.',
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    borderColor: 'group-hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/10 text-cyan-500',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
  },
};

const CategoriesScreen = () => {
  const { data: categories, isLoading, error } = useGetProductCategoriesQuery();

  return (
    <div className="space-y-8">
      <Meta title="Shop by Category - NOVA" description="Browse premium products across various categories." />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 text-center sm:text-left border border-border/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="h-3 w-3" />
            Explore our collections
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Shop by Category
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
            Find exactly what you're looking for with our curated range of products designed for elite productivity and tech styling.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block select-none pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary)_0,transparent_100%)] blur-2xl" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-card border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl border border-destructive/20 text-sm">
          {error?.data?.message || error.error || 'Failed to load categories'}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category, idx) => {
            const meta = categoryMeta[category.toLowerCase()] || {
              name: category,
              icon: Headphones,
              description: `Explore premium products under the ${category} category.`,
              gradient: 'from-slate-500/10 via-slate-500/5 to-transparent',
              borderColor: 'group-hover:border-slate-500/50',
              iconBg: 'bg-slate-500/10 text-slate-500',
              image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80',
            };

            const IconComponent = meta.icon;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={`/search?category=${category}`}
                  className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
                >
                  {/* Decorative Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-60 transition-opacity duration-300 group-hover:opacity-80`} />

                  {/* Content Layout */}
                  <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground capitalize tracking-tight flex items-center gap-1.5">
                          {meta.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {meta.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary group-hover:text-indigo-600 transition-colors pt-2">
                      <span>Browse Products</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
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

import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Meta from '../components/Meta';
import { ArrowRight, Package, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '../components/ProductCard';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleIn,
} from '@/lib/animations';
import { toast } from 'react-toastify';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ₹1,000',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: '100% protected transactions',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team',
  },
  {
    icon: Package,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
];

const HomeScreen = () => {
  const [email, setEmail] = useState('');
  const { data, isLoading } = useGetProductsQuery({});
  const dbProducts = data?.products || [];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  const categories = [
    { name: 'Audio', slug: 'Audio' },
    { name: 'Wearables', slug: 'Wearables' },
    { name: 'Accessories', slug: 'Accessories' },
    { name: 'Storage', slug: 'Storage' },
    { name: 'Smart Home', slug: 'Smart Home' },
    { name: 'Gaming', slug: 'Gaming' },
  ];

  const categoryCounts = useMemo(() => {
    const counts = {};
    dbProducts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [dbProducts]);

  return (
    <div className="min-h-screen space-y-16">
      <Meta title="ShopSphere - Modern Tech & Electronics Store" />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="secondary" className="mb-4">
                  New Collection 2024
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground"
              >
                Experience the{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Future
                </span>{' '}
                of Tech
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl"
              >
                Discover premium products designed for modern living. From cutting-edge
                audio to smart wearables, elevate your everyday experience.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Button size="lg" asChild className="shadow-lg">
                  <Link to="/search">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/categories">Explore Categories</Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 flex justify-center gap-8 lg:justify-start"
              >
                {[
                  { value: '10K+', label: 'Products' },
                  { value: '50K+', label: 'Customers' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-foreground sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image/Product Showcase */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-muted to-muted/50 shadow-2xl">
                <img
                  src="/images/hero.png"
                  alt="Premium tech products showcase"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -left-4 top-8 rounded-2xl bg-card p-4 shadow-xl border border-border/50 lg:-left-12"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                    <Truck className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Free Delivery</p>
                    <p className="text-xs text-muted-foreground">On all orders</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -right-4 bottom-8 rounded-2xl bg-card p-4 shadow-xl border border-border/50 lg:-right-12"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">100% Protected</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="flex items-center gap-4 text-left"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 text-left">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-end justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                Featured Products
              </h2>
              <p className="mt-2 text-muted-foreground">
                Our most popular items, handpicked for you
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/search">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
                ))
              : dbProducts.slice(0, 8).map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/search">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 text-left">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Shop by Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category) => (
              <motion.div key={category.slug} variants={staggerItem}>
                <Link
                  to={`/search?category=${encodeURIComponent(category.name)}`}
                  className="group block overflow-hidden rounded-2xl bg-card border border-border/50 p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryCounts[category.name] || 0} products
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 text-left">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 sm:p-12 border border-primary/20"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <Badge variant="secondary" className="mb-4 bg-primary/20">
                  Limited Time
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                  Special Offers
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Save big on our best-selling products. Hurry, these deals won't last forever!
                </p>
                <Button asChild className="mt-6" size="lg">
                  <Link to="/deals">
                    Shop Deals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
                {dbProducts.slice(0, 2).map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Stay Updated
            </h2>
            <p className="mt-2 text-muted-foreground">
              Subscribe to our newsletter for exclusive deals and new arrivals
            </p>
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 rounded-xl border border-input bg-background px-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-80"
              />
              <Button type="submit" size="lg" className="h-12">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              By subscribing, you agree to our Privacy Policy
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;

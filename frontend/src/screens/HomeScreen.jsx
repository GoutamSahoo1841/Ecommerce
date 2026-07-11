import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Meta from '../components/Meta';
import { ArrowRight, Heart, Star, Truck, Shield, Headphones, Package } from 'lucide-react';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { toast } from 'react-toastify';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  // Fetch products from the API to dynamically count categories and get MongoDB IDs
  const { data, isLoading } = useGetProductsQuery({});
  const dbProducts = data?.products || [];

  // Compute category counts dynamically, with default fallback counts from the design
  const categoryCounts = useMemo(() => {
    const counts = {
      Audio: 3,
      Wearables: 1,
      Accessories: 5,
      Storage: 1,
      'Smart Home': 1,
      Gaming: 1,
    };
    if (dbProducts && dbProducts.length > 0) {
      const dynamicCounts = {};
      dbProducts.forEach((p) => {
        if (p.category) {
          dynamicCounts[p.category] = (dynamicCounts[p.category] || 0) + 1;
        }
      });
      Object.keys(counts).forEach((cat) => {
        if (dynamicCounts[cat] !== undefined) {
          counts[cat] = dynamicCounts[cat];
        }
      });
    }
    return counts;
  }, [dbProducts]);

  // Retrieve the specific products featured in "Featured Products"
  const featuredProducts = useMemo(() => {
    const headphone = dbProducts.find((p) => p.name.includes('Nova Pro Wireless Headphones')) || {
      _id: '1',
      name: 'Nova Pro Wireless Headphones',
      image: '/images/product-headphones.png',
      price: 349,
      originalPrice: 449,
      rating: 4.9,
      numReviews: 2847,
      badge: 'Best Seller',
      category: 'Audio',
    };

    const watch = dbProducts.find((p) => p.name.includes('Ultra Smart Watch Series X')) || {
      _id: '2',
      name: 'Ultra Smart Watch Series X',
      image: '/images/product-smartwatch.png',
      price: 499,
      originalPrice: 599,
      rating: 4.8,
      numReviews: 1923,
      badge: 'New',
      category: 'Wearables',
    };

    const ssd = dbProducts.find((p) => p.name.includes('Portable SSD 2TB')) || {
      _id: '8',
      name: 'Portable SSD 2TB',
      image: '/images/product-ssd.png',
      price: 249,
      originalPrice: 299,
      rating: 4.9,
      numReviews: 2134,
      badge: 'Top Rated',
      category: 'Storage',
    };

    return [
      { ...headphone, categoryLabel: 'AUDIO', discount: '-22%' },
      { ...watch, categoryLabel: 'WEARABLES', discount: '-17%' },
      { ...ssd, categoryLabel: 'STORAGE', discount: '-17%' },
    ];
  }, [dbProducts]);

  // Retrieve the specific two products featured in "Special Offers"
  const specialOffersProducts = useMemo(() => {
    return featuredProducts.slice(0, 2);
  }, [featuredProducts]);

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      toast.info('Please sign in to add items to your wishlist');
      navigate('/login');
      return;
    }
    const isWishlisted = wishlistItems.some((item) => item._id === product._id);
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

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
    { name: 'Audio', countKey: 'Audio', defaultCount: 3 },
    { name: 'Wearables', countKey: 'Wearables', defaultCount: 1 },
    { name: 'Accessories', countKey: 'Accessories', defaultCount: 5 },
    { name: 'Storage', countKey: 'Storage', defaultCount: 1 },
    { name: 'Smart Home', countKey: 'Smart Home', defaultCount: 1 },
    { name: 'Gaming', countKey: 'Gaming', defaultCount: 1 },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: Shield, title: 'Secure Payments', desc: '100% protected transactions' },
    { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support team' },
    { icon: Package, title: 'Easy Returns', desc: '30-day return policy' },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 md:space-y-24 pb-6">
      <Meta />

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left py-4 sm:py-6">
        {/* Left Side Content */}
        <div className="lg:col-span-6 space-y-6">
          <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-full w-fit">
            New Collection 2024
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
            Experience the<br />
            <span className="text-blue-600">Future</span> of Tech
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Discover premium products designed for modern living. From cutting-edge audio to smart wearables, elevate your everyday experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#featured-section">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-xs text-sm">
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <Link to="/categories">
              <button className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs text-sm">
                Explore Categories
              </button>
            </Link>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/80 max-w-md">
            {[
              { value: '10K+', label: 'Products' },
              { value: '50K+', label: 'Customers' },
              { value: '4.9', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Image Showcase with Floating Cards */}
        <div className="lg:col-span-6 relative flex justify-center items-center w-full">
          <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden bg-slate-50/70 dark:bg-slate-800/30 flex items-center justify-center p-4 border border-slate-100/50 dark:border-slate-800/40 shadow-xs">
            <img
              src="/images/hero.png"
              alt="Nova Hero Showcase"
              className="object-contain max-h-[95%] max-w-[95%] select-none"
            />
          </div>

          {/* Floating Card 1 (Top-Left) */}
          <div className="absolute -left-2 sm:-left-6 top-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-100 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-md flex items-center gap-3 z-10 hover:translate-y-[-2px] transition-transform duration-300">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Free Delivery</p>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">On all orders</p>
            </div>
          </div>

          {/* Floating Card 2 (Bottom-Right) */}
          <div className="absolute -right-2 sm:-right-6 bottom-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-100 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-md flex items-center gap-3 z-10 hover:translate-y-[-2px] transition-transform duration-300">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-500">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Secure Payment</p>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">100% Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-6 border-y border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-4 p-2">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 shadow-2xs">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{f.title}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Products Section */}
      <section id="featured-section" className="text-left scroll-mt-24">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Featured Products
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              Our most popular items, handpicked for you
            </p>
          </div>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-semibold flex items-center gap-1 group transition-colors">
            View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => {
            const isWish = wishlistItems.some((item) => item._id === p._id);
            return (
              <div
                key={p._id}
                className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-slate-200 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col relative"
              >
                <Link to={`/product/${p._id}`} className="flex-1 flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-center p-5">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="object-contain max-h-full max-w-full hover:scale-105 transition-transform duration-500 select-none"
                    />

                    {/* Badges on top-left of image */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
                      {p.badge && (
                        <span className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-xs shadow-xs text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800/50">
                          {p.badge}
                        </span>
                      )}
                      {p.discount && (
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200/40 dark:border-slate-700/30 w-fit">
                          {p.discount}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Icon */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, p)}
                      className={`absolute right-3 top-3 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs transition-colors focus:outline-hidden ${isWish ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${isWish ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Text Details below image */}
                  <div className="mt-4 sm:mt-5 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                        {p.categoryLabel}
                      </span>
                      <h3 className="mt-1 line-clamp-1 font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-[15px] sm:text-base">
                        {p.name}
                      </h3>

                      {/* Rating row */}
                      <div className="mt-2 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 border-none" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.rating}</span>
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          ({p.numReviews.toLocaleString()})
                        </span>
                      </div>
                    </div>

                    {/* Prices row */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                        ${p.price}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through">
                          ${p.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="text-center pt-4">
        <div className="space-y-2.5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Shop by Category
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-8 sm:mt-10">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/search?category=${encodeURIComponent(cat.name)}`}
              className="group flex items-center justify-between p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 dark:hover:border-slate-700/80 transition-all duration-300"
            >
              <div className="text-left">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg transition-colors group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-medium mt-0.5 capitalize">
                  {categoryCounts[cat.countKey] ?? cat.defaultCount} products
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="bg-gradient-to-br from-blue-50/70 to-indigo-100/40 dark:from-slate-950 dark:to-slate-900/60 border border-slate-100/50 dark:border-slate-800/40 rounded-[32px] p-8 sm:p-10 md:p-12 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Block */}
          <div className="lg:col-span-5 space-y-5 lg:space-y-6 text-left">
            <span className="inline-block bg-blue-100/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
              Limited Time
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              Special Offers
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm">
              Save big on our best-selling products. Hurry, these deals won't last forever!
            </p>
            <Link to="/deals">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2 transition-colors mt-6 shadow-sm hover:shadow-md text-sm">
                Shop Deals <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {specialOffersProducts.map((p) => {
              const isWish = wishlistItems.some((item) => item._id === p._id);
              return (
                <div
                  key={p._id}
                  className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-slate-200 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col relative"
                >
                  <Link to={`/product/${p._id}`} className="flex-1 flex flex-col">
                    {/* Image Container with light gray bg */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-center p-5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="object-contain max-h-full max-w-full hover:scale-105 transition-transform duration-500 select-none"
                      />

                      {/* Badges on top-left of image */}
                      <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
                        {p.badge && (
                          <span className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-xs shadow-xs text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800/50">
                            {p.badge}
                          </span>
                        )}
                        {p.discount && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200/40 dark:border-slate-700/30 w-fit">
                            {p.discount}
                          </span>
                        )}
                      </div>

                      {/* Wishlist Icon on top-right of image */}
                      <button
                        onClick={(e) => handleToggleWishlist(e, p)}
                        className={`absolute right-3 top-3 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs transition-colors focus:outline-hidden ${isWish ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                          }`}
                      >
                        <Heart className={`h-4 w-4 ${isWish ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Text Details below image */}
                    <div className="mt-4 sm:mt-5 text-left flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                          {p.categoryLabel}
                        </span>
                        <h3 className="mt-1 line-clamp-1 font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-[15px] sm:text-base">
                          {p.name}
                        </h3>

                        {/* Rating row */}
                        <div className="mt-2 flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 border-none" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.rating}</span>
                          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            ({p.numReviews.toLocaleString()})
                          </span>
                        </div>
                      </div>

                      {/* Prices row */}
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                          ${p.price}
                        </span>
                        {p.originalPrice && (
                          <span className="text-xs sm:text-sm text-slate-400 line-through">
                            ${p.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stay Updated Section */}
      <section className="py-8 sm:py-12 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center text-center">
        <div className="max-w-md w-full px-4 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Stay Updated
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Subscribe to our newsletter for exclusive deals and new arrivals
          </p>

          <form onSubmit={handleSubscribe} className="pt-6 flex flex-col sm:flex-row items-center gap-3 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-3">
            By subscribing, you agree to our{' '}
            <Link to="/privacy" className="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;

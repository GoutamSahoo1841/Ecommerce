import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Minus,
  Plus,
  Share2,
  Sparkles,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '../components/ProductCard';
import {
  useGetProductDetailsQuery,
  useCreateProductReviewMutation,
  useGetRelatedProductsQuery,
} from '../slices/productsApiSlice';
import { addToCart, enableBuyNow } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { addRecentlyViewed } from '../slices/recentlyViewedSlice';
import Meta from '../components/Meta';
import { fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/currencyUtils';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const { data: relatedProducts } = useGetRelatedProductsQuery(productId);
  const [createProductReview, { isLoading: loadingProductReview }] = useCreateProductReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { recentlyViewed } = useSelector((state) => state.recentlyViewed);

  useEffect(() => {
    if (product) {
      dispatch(addRecentlyViewed(product));
      setQty(1);
      setCurrentImageIndex(0);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    }
  }, [dispatch, product]);

  const isWishlisted = wishlistItems?.some((item) => item._id === product?._id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.info('Please sign in to manage your wishlist');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.info('Please sign in to add items to your cart');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    dispatch(addToCart({ ...product, qty, selectedColor, selectedSize }));
    toast.success(`Added ${qty} ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    if (!userInfo) {
      toast.info('Please sign in to purchase');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    dispatch(enableBuyNow({ ...product, qty, selectedColor, selectedSize }));
    navigate('/shipping');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createProductReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review submitted successfully');
      setRating(5);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        <span>Loading product details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-2xl border border-destructive/20 text-sm">
        {error?.data?.message || error.error || 'An error occurred fetching product'}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
        <Button asChild>
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const inStock = product.countInStock > 0;

  return (
    <div className="min-h-screen pt-4 text-left">
      <Meta title={product.name} description={product.description} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/search" className="hover:text-foreground">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </motion.nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Images Gallery */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <div className="group relative aspect-square overflow-hidden rounded-3xl bg-muted border border-border/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex h-full w-full items-center justify-center"
                >
                  {allImages[currentImageIndex] ? (
                    <img
                      src={allImages[currentImageIndex]}
                      alt={`${product.name} view ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <ShoppingBag className="h-32 w-32 text-muted-foreground/20" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
                {product.badge && (
                  <Badge variant={product.badge === 'Sale' ? 'destructive' : 'secondary'}>
                    {product.badge}
                  </Badge>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge variant="secondary">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted transition-all ${
                      currentImageIndex === index
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            <div className="flex-1">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                {product.brand || product.category}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-foreground">{product.rating || 0}</span>
                <span className="text-muted-foreground">
                  ({(product.numReviews || 0).toLocaleString('en-IN')} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

              <Separator className="my-6" />

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-foreground">
                    Color: <span className="text-muted-foreground">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex h-10 items-center justify-center rounded-lg border px-4 text-sm transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border hover:border-foreground text-muted-foreground'
                        }`}
                      >
                        {selectedColor === color && (
                          <Check className="mr-2 h-4 w-4 text-primary" />
                        )}
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-foreground">
                    Size: <span className="text-muted-foreground">{selectedSize}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-10 w-16 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border hover:border-foreground text-muted-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              {inStock && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-foreground">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-lg font-medium text-foreground">
                      {qty}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {inStock ? (
                <>
                  <Button size="lg" className="flex-1 shadow-lg" onClick={handleBuyNow}>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1 shadow-sm" onClick={handleAddToCart}>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </>
              ) : (
                <Button size="lg" disabled className="w-full">
                  Out of Stock
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
                className={isWishlisted ? 'text-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Feature Callouts */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Warranty Protection' },
                { icon: RotateCcw, label: '30-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-4 text-center border border-border/40"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs: Description, Specifications, Reviews */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3">
                Reviews ({product.numReviews || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6 text-left">
              <div className="prose prose-neutral max-w-none dark:prose-invert text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-4">
                  Experience premium quality with {product.name}. Designed for
                  modern living, this product combines cutting-edge technology with
                  elegant aesthetics to deliver an exceptional user experience.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6 text-left">
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Brand', value: product.brand },
                  { label: 'Rating', value: `${product.rating || 0} / 5` },
                  { label: 'Reviews', value: (product.numReviews || 0).toLocaleString('en-US') },
                  { label: 'Stock Status', value: product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock' },
                  ...(product.colors && product.colors.length > 0 ? [{ label: 'Available Colors', value: product.colors.join(', ') }] : []),
                  ...(product.sizes && product.sizes.length > 0 ? [{ label: 'Available Sizes', value: product.sizes.join(', ') }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-muted/40 p-4 border border-border/40">
                    <dt className="text-xs text-muted-foreground uppercase font-semibold">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 text-left space-y-8">
              <div className="space-y-4">
                {!product.reviews || product.reviews.length === 0 ? (
                  <div className="text-center py-12 bg-muted/20 rounded-2xl border border-border/40">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">No customer reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  product.reviews.map((review) => (
                    <Card key={review._id} className="border border-border/50">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-foreground text-sm">{review.name}</strong>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {review.createdAt?.substring(0, 10)}
                        </p>
                        <p className="text-sm text-foreground/90 mt-2">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Review Form */}
              <Card className="border border-border/50 bg-card">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Write a Review
                  </h3>

                  {userInfo ? (
                    <form onSubmit={submitReviewHandler} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Rating</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Review Comment</label>
                        <textarea
                          rows="4"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts about this product..."
                          className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                      </div>
                      <Button type="submit" disabled={loadingProductReview}>
                        {loadingProductReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </form>
                  ) : (
                    <div className="bg-primary/10 text-primary p-4 rounded-xl text-sm">
                      Please <Link to="/login" className="underline font-semibold">sign in</Link> to write a review.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 text-left"
          >
            <h2 className="mb-8 text-2xl font-bold text-foreground">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((p, index) => (
                <ProductCard key={p._id} product={p} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Recently Viewed */}
        {recentlyViewed && recentlyViewed.length > 1 && (
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 text-left"
          >
            <h2 className="mb-8 text-2xl font-bold text-foreground">Recently Viewed</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyViewed
                .filter((p) => (p._id || p.id) !== product._id)
                .slice(0, 4)
                .map((p, index) => (
                  <ProductCard key={p._id || p.id} product={p} index={index} />
                ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductScreen;

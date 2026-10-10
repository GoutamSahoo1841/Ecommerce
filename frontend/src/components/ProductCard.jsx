import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cardHover, buttonTap, fadeInUp } from '@/lib/animations';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/currencyUtils';

export function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const productId = product._id || product.id;
  const isWishlisted = wishlistItems?.some((item) => (item._id || item.id) === productId);
  const inStock = product.countInStock !== undefined ? product.countInStock > 0 : product.inStock;
  const reviewsCount = product.numReviews !== undefined ? product.numReviews : product.reviews || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${productId}`}>
        <motion.div
          whileHover={cardHover}
          className="group relative overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg border border-border/50 flex flex-col h-full justify-between"
        >
          {/* Image Container */}
          <div className="group/image relative aspect-square overflow-hidden bg-muted">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover/image:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
              {product.badge && (
                <Badge
                  variant={product.badge === 'Sale' ? 'destructive' : 'secondary'}
                  className="shadow-sm"
                >
                  {product.badge}
                </Badge>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge variant="secondary" className="shadow-sm">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              whileTap={buttonTap}
              onClick={handleToggleWishlist}
              className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-colors z-10 ${
                isWishlisted ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>

            {/* Quick Add */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 z-10 transition-all duration-200"
            >
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full shadow-lg"
                size="sm"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </motion.div>
          </div>

          {/* Details */}
          <div className="p-4 flex flex-col flex-1 justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.category || product.brand}
              </p>
              <h3 className="mt-1 line-clamp-1 font-semibold text-foreground">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{product.rating || 0}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({reviewsCount.toLocaleString('en-IN')})
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm border border-border/50">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <div className="absolute inset-0 shimmer" />
      </div>
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded-full bg-muted shimmer" />
        <div className="h-5 w-full rounded-full bg-muted shimmer" />
        <div className="h-4 w-24 rounded-full bg-muted shimmer" />
        <div className="h-6 w-20 rounded-full bg-muted shimmer" />
      </div>
    </div>
  );
}

export default ProductCard;

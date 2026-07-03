import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { toast } from 'react-toastify';

const Product = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`Added ${product.name} to cart`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  // Calculate percentage off
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Define card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${product._id}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-lg duration-300"
        >
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden bg-secondary/30">
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
            />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
              {product.badge ? (
                <Badge 
                  variant="default" 
                  className={`shadow-sm font-semibold border-none py-1 text-white ${
                    product.badge.toLowerCase() === 'sale' ? 'bg-rose-500' :
                    product.badge.toLowerCase() === 'new' ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                >
                  {product.badge}
                </Badge>
              ) : (
                product.rating >= 4.8 && (
                  <Badge variant="default" className="shadow-sm font-semibold bg-indigo-600 text-white border-none py-1">
                    Best Seller
                  </Badge>
                )
              )}
              {hasDiscount && (!product.badge || product.badge.toLowerCase() !== 'sale') && (
                <Badge variant="destructive" className="shadow-sm font-semibold border-none py-1 bg-rose-500 text-white">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Wishlist Toggle Button */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 dark:bg-card/85 backdrop-blur-sm shadow-sm transition-colors focus:outline-none ${
                isWishlisted ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Add To Cart Slide-up Button */}
            <div
              className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all z-10"
            >
              <Button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="w-full shadow-lg rounded-xl text-xs py-2 bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center gap-1.5 h-9"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {product.category}
            </span>
            <h3 className="mt-1 line-clamp-1 font-semibold text-foreground hover:text-primary transition-colors text-sm sm:text-base">
              {product.name}
            </h3>
            
            {/* Ratings */}
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-foreground">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.numReviews})</span>
            </div>

            {/* Pricing details */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-foreground">${product.price}</span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default Product;

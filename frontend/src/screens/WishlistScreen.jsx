import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';
import { Heart, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { toast } from 'react-toastify';

const WishlistScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  const removeFromWishlistHandler = (id) => {
    if (!userInfo) {
      toast.info('Please sign in to modify your wishlist');
      navigate('/login');
      return;
    }
    dispatch(removeFromWishlist(id));
    toast.success('Removed from wishlist');
  };

  const addToCartHandler = (item) => {
    if (!userInfo) {
      toast.info('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ ...item, qty: 1 }));
    toast.success(`Added ${item.name} to cart`);
  };

  const clearWishlistHandler = () => {
    if (!userInfo) {
      toast.info('Please sign in to modify your wishlist');
      navigate('/login');
      return;
    }
    wishlistItems.forEach((item) => {
      dispatch(removeFromWishlist(item._id));
    });
    toast.success('Wishlist cleared');
  };

  const addAllToCartHandler = () => {
    if (!userInfo) {
      toast.info('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    wishlistItems.forEach((item) => {
      if (item.countInStock > 0) {
        dispatch(addToCart({ ...item, qty: 1 }));
      }
    });
    toast.success('All available items added to cart');
  };

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">My Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {wishlistItems.length} items saved
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearWishlistHandler} className="rounded-xl h-10 text-xs">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
            <Button onClick={addAllToCartHandler} className="rounded-xl h-10 text-xs text-white">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add All to Cart
            </Button>
          </div>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border/50 rounded-3xl p-12 shadow-sm space-y-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary mx-auto">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Save your favorite items to your wishlist for later!
            </p>
          </div>
          <Button asChild size="lg" className="rounded-xl text-white">
            <Link to="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item._id} className="overflow-hidden shadow-sm relative group">
              {/* Delete from wishlist button */}
              <button 
                onClick={() => removeFromWishlistHandler(item._id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-card/80 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 rounded-full flex items-center justify-center shadow-sm border border-border/50 transition-colors focus:outline-none"
                title="Remove from wishlist"
              >
                <XIcon className="w-4 h-4" />
              </button>
              
              {/* Image */}
              <Link to={`/product/${item._id}`} className="block relative aspect-square overflow-hidden bg-secondary/30">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </Link>
              
              {/* Content */}
              <div className="p-4 flex flex-col justify-between h-[150px]">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.brand}</span>
                  <Link to={`/product/${item._id}`}>
                    <h3 className="text-sm font-bold text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center justify-between border-t border-border/30 pt-3">
                  <span className="text-base font-extrabold text-primary">${item.price}</span>
                  <Button 
                    onClick={() => addToCartHandler(item)}
                    disabled={item.countInStock === 0}
                    size="sm"
                    className="rounded-xl text-xs h-8 text-white px-3 font-semibold"
                  >
                    {item.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple internal icon helper for X
const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default WishlistScreen;

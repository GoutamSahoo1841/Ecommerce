import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart, removeFromCart, applyCoupon, removeCoupon } from '../slices/cartSlice';
import { useLazyGetCouponByCodeQuery } from '../slices/couponsApiSlice';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  X, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, couponCode, discountPercentage } = cart;

  const [couponInput, setCouponInput] = useState('');

  const [getCoupon, { isLoading: loadingCoupon }] = useLazyGetCouponByCodeQuery();

  const handleQtyChange = (item, newQty) => {
    if (newQty >= 1 && newQty <= item.countInStock) {
      dispatch(addToCart({ ...item, qty: newQty }));
    }
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const applyCouponHandler = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    try {
      const res = await getCoupon(couponInput.trim()).unwrap();
      dispatch(applyCoupon({ code: res.code, discountPercentage: res.discountPercentage }));
      toast.success('Coupon applied successfully');
      setCouponInput('');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Invalid coupon');
    }
  };

  const removeCouponHandler = () => {
    dispatch(removeCoupon());
    toast.success('Coupon removed');
  };

  const subtotalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const discountAmount = (subtotalPrice * discountPercentage) / 100;
  const totalPrice = subtotalPrice - discountAmount;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
        Shopping <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Cart</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border/50 rounded-3xl p-12 shadow-sm space-y-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary mx-auto">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Explore our collection!</p>
          </div>
          <Button asChild size="lg" className="rounded-xl text-white">
            <Link to="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <Card key={item._id} className="overflow-hidden shadow-sm">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-secondary/30 border border-border/30">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover select-none" 
                    />
                  </div>
                  
                  {/* Name and Price */}
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <Link to={`/product/${item._id}`} className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <span className="text-sm font-semibold text-muted-foreground block">{item.brand}</span>
                    
                    {/* Chosen color & size options */}
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5">
                        {item.selectedColor && (
                          <Badge variant="outline" className="text-xs text-muted-foreground font-semibold px-2 py-0.5 border-border/80">
                            Color: <span className="text-foreground ml-1">{item.selectedColor}</span>
                          </Badge>
                        )}
                        {item.selectedSize && (
                          <Badge variant="outline" className="text-xs text-muted-foreground font-semibold px-2 py-0.5 border-border/80">
                            Size: <span className="text-foreground ml-1">{item.selectedSize}</span>
                          </Badge>
                        )}
                      </div>
                    )}

                    <span className="text-base sm:text-lg font-bold text-primary block">${item.price}</span>
                  </div>

                  {/* Quantity Stepper & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-border/30">
                    <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQtyChange(item, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className="h-8 w-8 rounded-lg"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold text-foreground">{item.qty}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQtyChange(item, item.qty + 1)}
                        disabled={item.qty >= item.countInStock}
                        className="h-8 w-8 rounded-lg"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-9 w-9 shrink-0"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4">
            <Card className="sticky top-28 shadow-md">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border/50 pb-4">Order Summary</h2>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                    <span className="font-semibold text-foreground">${subtotalPrice.toFixed(2)}</span>
                  </div>
                  
                  {discountPercentage > 0 && (
                    <div className="flex justify-between items-center text-emerald-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        Discount ({discountPercentage}%)
                      </span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="h-px bg-border/50" />
                  
                  <div className="flex justify-between items-center text-base font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-xl text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code Block */}
                <div className="pt-2">
                  {couponCode ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-4 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">Applied Promo</span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold text-base">{couponCode}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={removeCouponHandler}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-rose-500 rounded-full h-8 w-8 hover:bg-rose-500/10"
                        title="Remove Coupon"
                      >
                        <X className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={applyCouponHandler} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Promo Code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-secondary border border-border/50 rounded-xl px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none uppercase placeholder:text-muted-foreground/60"
                      />
                      <Button 
                        type="submit" 
                        disabled={loadingCoupon}
                        className="px-4 rounded-xl text-xs text-white font-semibold"
                      >
                        {loadingCoupon ? '...' : 'Apply'}
                      </Button>
                    </form>
                  )}
                </div>
                
                <Button 
                  className="w-full shadow-md py-6 rounded-xl font-bold flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary/95 text-base h-12"
                  disabled={cartItems.length === 0} 
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;

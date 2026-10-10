import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { addToCart, removeFromCart, applyCoupon, removeCoupon, disableBuyNow } from '../slices/cartSlice';
import { useLazyGetCouponByCodeQuery } from '../slices/couponsApiSlice';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/currencyUtils';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(disableBuyNow());
  }, [dispatch]);

  const cart = useSelector((state) => state.cart);
  const { cartItems, couponCode, discountPercentage } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const [couponInput, setCouponInput] = useState('');
  const [getCoupon, { isLoading: loadingCoupon }] = useLazyGetCouponByCodeQuery();

  const handleQtyChange = (item, newQty) => {
    if (!userInfo) {
      toast.info('Please sign in to update your cart');
      navigate('/login');
      return;
    }
    if (newQty >= 1 && newQty <= item.countInStock) {
      dispatch(addToCart({ ...item, qty: newQty }));
    }
  };

  const removeFromCartHandler = (id) => {
    if (!userInfo) {
      toast.info('Please sign in to modify your cart');
      navigate('/login');
      return;
    }
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const checkoutHandler = () => {
    dispatch(disableBuyNow());
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
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen pt-4 text-left">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Shopping Cart</span>
        </motion.nav>

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Shopping Cart
          {cartCount > 0 && (
            <span className="ml-2 text-muted-foreground font-normal text-2xl">({cartCount} items)</span>
          )}
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-3xl border border-border/50"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-foreground">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link to="/search">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={staggerItem}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="group flex gap-4 rounded-2xl bg-card p-4 shadow-sm border border-border/50 sm:gap-6"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-32 border border-border/40">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            to={`/product/${item._id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors text-base"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            {item.brand && <span>Brand: {item.brand}</span>}
                            {item.selectedColor && (
                              <>
                                <span>·</span>
                                <span>Color: {item.selectedColor}</span>
                              </>
                            )}
                            {item.selectedSize && (
                              <>
                                <span>·</span>
                                <span>Size: {item.selectedSize}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQtyChange(item, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium text-foreground">
                              {item.qty}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQtyChange(item, item.qty + 1)}
                              disabled={item.qty >= item.countInStock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-foreground">
                              {formatPrice(item.price * item.qty)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCartHandler(item._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:sticky lg:top-24"
            >
              <div className="rounded-2xl bg-card p-6 shadow-sm border border-border/50 space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

                {/* Promo Code */}
                <div>
                  {couponCode ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Applied Code</p>
                          <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{couponCode} ({discountPercentage}% OFF)</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={removeCouponHandler}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={applyCouponHandler} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Promo code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="pl-9 text-sm uppercase"
                        />
                      </div>
                      <Button type="submit" variant="outline" disabled={loadingCoupon}>
                        {loadingCoupon ? '...' : 'Apply'}
                      </Button>
                    </form>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotalPrice)}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex items-center justify-between text-sm text-emerald-500">
                      <span>Discount ({discountPercentage}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success font-medium">Calculated at next step</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>Estimated Total</span>
                    <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full shadow-lg" onClick={checkoutHandler}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;

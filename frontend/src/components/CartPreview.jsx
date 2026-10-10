import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { formatPrice } from '../utils/currencyUtils';

export function CartPreview({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalPrice, itemsPrice } = useSelector((state) => state.cart);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleQuantityChange = (item, newQty) => {
    if (newQty > 0 && newQty <= item.countInStock) {
      dispatch(addToCart({ ...item, qty: newQty }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {cartCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                {cartCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-center text-muted-foreground">
              Your cart is empty
            </p>
            <Button onClick={() => onOpenChange(false)} asChild>
              <Link to="/search">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4 py-4"
              >
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={staggerItem}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex gap-4 rounded-xl bg-card p-3 shadow-sm border border-border/50"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="line-clamp-1 font-medium text-sm text-foreground">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                item.qty > 1
                                  ? handleQuantityChange(item, item.qty - 1)
                                  : handleRemove(item._id)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.qty}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              disabled={item.qty >= item.countInStock}
                              onClick={() => handleQuantityChange(item, item.qty + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-semibold text-sm">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleRemove(item._id)}
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>

            <div className="space-y-4 border-t border-border pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(itemsPrice || cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold text-base">
                  <span>Estimated Total</span>
                  <span>{formatPrice(totalPrice || cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Button
                  size="lg"
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/shipping');
                  }}
                >
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/cart');
                  }}
                >
                  View Full Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

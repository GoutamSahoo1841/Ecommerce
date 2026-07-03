import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ShoppingBag, MapPin, CreditCard, Tag } from 'lucide-react';
import { toast } from 'react-toastify';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        discountPrice: cart.discountPrice,
        couponCode: cart.couponCode,
      }).unwrap();
      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to place order');
    }
  };

  return (
    <div className="space-y-8">
      <CheckoutSteps step1 step2 step3 step4 />
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Review Order</h1>
        <p className="text-sm text-muted-foreground">Please review your items and details before placing the order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Shipping Details
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Method: </strong>
                {cart.paymentMethod}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Order Items
              </h2>
              {cart.cartItems.length === 0 ? (
                <div className="text-muted-foreground text-sm text-center py-6 bg-secondary/20 rounded-2xl">
                  Your cart is empty
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-secondary/30">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product || item._id}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate block">
                          {item.name}
                        </Link>
                        <span className="text-xs text-muted-foreground block mt-0.5">{item.brand}</span>
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex gap-2 mt-1">
                            {item.selectedColor && (
                              <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                                Color: {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-bold text-foreground whitespace-nowrap">
                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-28 shadow-md">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-foreground border-b border-border/50 pb-4">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="font-semibold text-foreground">${cart.itemsPrice}</span>
                </div>
                {cart.discountPrice > 0 && (
                  <div className="flex justify-between text-emerald-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      Discount ({cart.couponCode})
                    </span>
                    <span>-${cart.discountPrice}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-foreground">${cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-foreground">${cart.taxPrice}</span>
                </div>
                
                <div className="h-px bg-border/50" />
                
                <div className="flex justify-between items-center text-base font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-xl text-primary">${cart.totalPrice}</span>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs text-center">
                  {error?.data?.message || error.error || 'Failed to place order'}
                </div>
              )}

              <Button
                type="button"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
                className="w-full shadow-md py-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/95 text-base h-12"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;

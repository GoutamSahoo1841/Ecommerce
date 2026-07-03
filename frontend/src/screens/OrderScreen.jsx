import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { 
  useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Check, 
  X, 
  Info,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Payment completed successfully!');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to capture payment');
      }
    });
  };

  const onError = (err) => {
    toast.error(err?.message || 'PayPal payment error occurred');
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
          },
        },
      ],
    });
  };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order marked as delivered successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update delivery');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-muted-foreground text-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        Loading Order Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
        {error?.data?.message || error.error || 'Failed to fetch order details'}
      </div>
    );
  }

  const timeline = [
    { name: 'Ordered', done: true, sub: 'Order placed' },
    { name: 'Paid', done: order.isPaid, sub: order.isPaid ? `Paid on ${order.paidAt.substring(0, 10)}` : 'Awaiting payment' },
    { name: 'Delivered', done: order.isDelivered, sub: order.isDelivered ? `Delivered on ${order.deliveredAt.substring(0, 10)}` : 'In transit' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Order Details</h1>
        <p className="text-sm font-mono text-muted-foreground mt-1">ID: {order._id.toUpperCase()}</p>
      </div>

      {/* Visual Timeline Stepper */}
      <Card className="shadow-sm border-border/50 bg-secondary/10">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center w-full">
          {timeline.map((step, idx) => {
            const isLast = idx === timeline.length - 1;
            return (
              <React.Fragment key={step.name}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                    step.done ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{step.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.sub}</p>
                  </div>
                </div>
                {!isLast && (
                  <div className={`hidden md:block h-0.5 flex-1 mx-4 ${
                    timeline[idx + 1].done ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Shipping Details
              </h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground font-semibold">Name: </strong> {order.user.name}</p>
                <p><strong className="text-foreground font-semibold">Email: </strong> <a href={`mailto:${order.user.email}`} className="text-primary hover:underline">{order.user.email}</a></p>
                <p>
                  <strong className="text-foreground font-semibold">Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
              
              {order.isDelivered ? (
                <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl border border-emerald-500/20 text-xs flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4" />
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </div>
              ) : (
                <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl border border-rose-500/20 text-xs flex items-center gap-2 font-medium">
                  <X className="w-4 h-4" />
                  Not Delivered
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </h2>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p><strong className="text-foreground font-semibold">Method: </strong> {order.paymentMethod}</p>
              </div>

              {order.isPaid ? (
                <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl border border-emerald-500/20 text-xs flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4" />
                  Paid on {order.paidAt.substring(0, 10)}
                </div>
              ) : (
                <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl border border-rose-500/20 text-xs flex items-center gap-2 font-medium">
                  <X className="w-4 h-4" />
                  Not Paid
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Order Items
              </h2>
              {order.orderItems.length === 0 ? (
                <div className="text-muted-foreground text-sm text-center py-6 bg-secondary/20 rounded-2xl">
                  Order is empty
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-secondary/30">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate block">
                          {item.name}
                        </Link>
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

        {/* Right Side Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-md sticky top-28">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-foreground border-b border-border/50 pb-4">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="font-semibold text-foreground">
                    ${order.itemsPrice || (order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-foreground">${order.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-foreground">${order.taxPrice}</span>
                </div>
                
                <div className="h-px bg-border/50" />
                
                <div className="flex justify-between items-center text-base font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-xl text-primary">${order.totalPrice}</span>
                </div>
              </div>

              {!order.isPaid && (
                <div className="border-t border-border/50 pt-6">
                  {loadingPay && <div className="text-center py-2 text-xs text-muted-foreground animate-pulse">Processing Payment...</div>}
                  {isPending ? (
                    <div className="flex justify-center items-center py-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  )}
                </div>
              )}
              
              {loadingDeliver && (
                <div className="flex justify-center items-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}

              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <Button
                  type="button"
                  className="w-full shadow-md text-white font-bold h-11"
                  onClick={deliverOrderHandler}
                >
                  Mark As Delivered
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;

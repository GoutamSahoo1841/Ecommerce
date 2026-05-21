import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl border border-red-200 dark:border-red-800 text-sm">
          {error?.data?.message || error.error || 'Failed to fetch order details'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Order Details</h1>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">Order ID: {order._id}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Shipping Details</h2>
            <div className="space-y-2 text-slate-600 dark:text-slate-300 mb-6">
              <p><strong className="text-slate-800 dark:text-slate-100">Name: </strong> {order.user.name}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Email: </strong> <a href={`mailto:${order.user.email}`} className="text-primary hover:underline">{order.user.email}</a></p>
              <p>
                <strong className="text-slate-800 dark:text-slate-100">Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
            
            {order.isDelivered ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl border border-green-200 dark:border-green-800/50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Delivered on {order.deliveredAt.substring(0, 10)}
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Not Delivered
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Payment Method</h2>
            <div className="space-y-2 text-slate-600 dark:text-slate-300 mb-6">
              <p><strong className="text-slate-800 dark:text-slate-100">Method: </strong> {order.paymentMethod}</p>
            </div>

            {order.isPaid ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl border border-green-200 dark:border-green-800/50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Paid on {order.paidAt.substring(0, 10)}
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Not Paid
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <div className="text-slate-500 text-center py-4 bg-slate-50 dark:bg-slate-900 rounded-xl">Order is empty</div>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product}`} className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary hover:underline truncate block">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-medium">${order.itemsPrice || (order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium">${order.taxPrice}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-xl font-extrabold text-primary">${order.totalPrice}</span>
              </div>
            </div>

            {/* PayPal integration placeholder will go here eventually */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;

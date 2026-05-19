import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-8">
        Shopping <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Cart</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700">
          <svg className="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Go Back
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md">
                <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 relative group">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item._id}`} className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <div className="text-primary font-bold text-xl mt-2">${item.price}</div>
                </div>

                <div className="flex items-center gap-4">
                  <select 
                    className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2 border-none focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer"
                    value={item.qty} 
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button 
                    type="button" 
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 sticky top-28">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button 
                type="button" 
                className="w-full btn-primary py-4 text-lg" 
                disabled={cartItems.length === 0} 
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;

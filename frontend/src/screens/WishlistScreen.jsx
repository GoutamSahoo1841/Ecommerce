import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';

const WishlistScreen = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const addToCartHandler = (item) => {
    dispatch(addToCart({ ...item, qty: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-xl border border-slate-100 dark:border-slate-700">
          <svg className="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Your wishlist is empty</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your wishlist yet. Explore our products and find something you love!
          </p>
          <Link to="/" className="btn-primary py-3 px-8 inline-flex items-center gap-2">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col group relative hover:shadow-xl transition-shadow duration-300">
              <button 
                onClick={() => removeFromWishlistHandler(item._id)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-colors"
                title="Remove from wishlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <Link to={`/product/${item._id}`} className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900 p-6">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
              </Link>
              
              <div className="p-6 flex flex-col flex-1">
                <Link to={`/product/${item._id}`} className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">{item.name}</h3>
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">${item.price}</span>
                  <button 
                    onClick={() => addToCartHandler(item)}
                    disabled={item.countInStock === 0}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      item.countInStock > 0 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {item.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistScreen;

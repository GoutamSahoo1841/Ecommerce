import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-6 rounded-2xl border border-red-200 dark:border-red-800">
        {error?.data?.message || error.error || 'An error occurred'}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Product not found</h2>
        <Link to="/" className="mt-4 text-primary hover:underline">Go Back</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-2 mb-8 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Go Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Product Image */}
        <div className="lg:col-span-1 rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 aspect-square flex items-center justify-center p-6">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-2xl hover:scale-105 transition-transform duration-500" />
        </div>

        {/* Product Details */}
        <div className="lg:col-span-1 flex flex-col justify-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{product.brand}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating || 0))}
              {'☆'.repeat(5 - Math.floor(product.rating || 0))}
            </div>
            <span className="text-sm text-slate-500">{product.rating} rating from {product.numReviews} reviews</span>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8">
            {product.description}
          </p>
        </div>

        {/* Action Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 sticky top-28">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Price:</span>
              <span className="text-3xl font-bold text-slate-900 dark:text-white">${product.price}</span>
            </div>
            
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Status:</span>
              <span className={`font-medium ${product.countInStock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Qty:</span>
                <select 
                  className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2 border-none focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer"
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button 
              disabled={product.countInStock === 0}
              className="w-full btn-primary py-4 text-lg"
              onClick={addToCartHandler}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;

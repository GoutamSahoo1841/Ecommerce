import React from 'react';
import { Link } from 'react-router-dom';
import products from '../products';

const HomeScreen = () => {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Products</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Discover our new arrivals and premium electronics tailored just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product._id} className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-700">
            <Link to={`/product/${product._id}`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-primary shadow-sm">
                  ${product.price}
                </div>
              </div>
            </Link>
            <div className="p-6">
              <Link to={`/product/${product._id}`}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-sm">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-xs text-slate-500 ml-2">({product.numReviews} reviews)</span>
              </div>
              <button className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;

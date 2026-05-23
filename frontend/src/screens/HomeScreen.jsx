import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import Product from '../components/Product';

const HomeScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({ pageNumber });
  const products = data?.products || [];

  const { recentlyViewedItems } = useSelector((state) => state.recentlyViewed);

  return (
    <div>
      <Meta />
      
      <ProductCarousel />

      {recentlyViewedItems && recentlyViewedItems.length > 0 && !pageNumber && (
        <div className="mb-16 mt-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Recently <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">Viewed</span>
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-4 custom-scrollbar snap-x">
            {recentlyViewedItems.map((product) => (
              <div key={product._id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                <Product product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-12 mt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Products</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Discover our new arrivals and premium electronics tailored just for you.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-6 rounded-2xl border border-red-200 dark:border-red-800">
          {error?.data?.message || error.error || 'An error occurred'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
      
      {data?.pages && data?.pages > 1 && (
        <Paginate
          pages={data.pages}
          page={data.page}
          keyword=""
        />
      )}
    </div>
  );
};

export default HomeScreen;

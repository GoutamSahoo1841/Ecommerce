import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useGetProductsQuery, useGetProductCategoriesQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Paginate from '../components/Paginate';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const pageNumber = searchParams.get('pageNumber') || '1';
  const category = searchParams.get('category') || 'all';
  const price = searchParams.get('price') || 'all';
  const rating = searchParams.get('rating') || 'all';

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
    price,
    rating,
  });

  const { data: categories, isLoading: loadingCategories, error: errorCategories } = useGetProductCategoriesQuery();

  const prices = [
    { name: '$1 to $50', value: '1-50' },
    { name: '$51 to $200', value: '51-200' },
    { name: '$201 to $1000', value: '201-1000' },
  ];

  const ratings = [
    { name: '4stars & up', rating: 4 },
    { name: '3stars & up', rating: 3 },
    { name: '2stars & up', rating: 2 },
    { name: '1stars & up', rating: 1 },
  ];

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterKeyword = filter.keyword || keyword;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    
    return `/search?category=${filterCategory}&keyword=${filterKeyword}&price=${filterPrice}&rating=${filterRating}&pageNumber=${filterPage}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Search Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Department</h3>
            {loadingCategories ? (
               <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-10 w-full rounded-md mb-2"></div>
            ) : errorCategories ? (
               <div className="text-red-500 text-sm">{errorCategories?.data?.message || errorCategories.error}</div>
            ) : (
              <ul className="space-y-2">
                <li>
                  <Link 
                    className={`block py-1 transition-colors ${category === 'all' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
                    to={getFilterUrl({ category: 'all', page: 1 })}
                  >
                    Any
                  </Link>
                </li>
                {categories?.map((c) => (
                  <li key={c}>
                    <Link 
                      className={`block py-1 transition-colors ${category === c ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
                      to={getFilterUrl({ category: c, page: 1 })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Price</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  className={`block py-1 transition-colors ${price === 'all' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
                  to={getFilterUrl({ price: 'all', page: 1 })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link 
                    className={`block py-1 transition-colors ${price === p.value ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
                    to={getFilterUrl({ price: p.value, page: 1 })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rating */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Avg. Customer Review</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  className={`block py-1 transition-colors ${rating === 'all' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
                  to={getFilterUrl({ rating: 'all', page: 1 })}
                >
                  Any
                </Link>
              </li>
              {ratings.map((r) => (
                <li key={r.rating}>
                  <Link 
                    className={`block py-1 transition-colors ${Number(rating) === r.rating ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
                    to={getFilterUrl({ rating: r.rating, page: 1 })}
                  >
                    <div className="flex items-center text-yellow-400">
                      {'★'.repeat(r.rating)}
                      {'☆'.repeat(5 - r.rating)}
                      <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">& Up</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {(keyword !== '' || category !== 'all' || rating !== 'all' || price !== 'all') && (
             <div className="mt-6">
                <Link to="/search" className="text-sm text-red-500 hover:underline">
                  <span className="flex items-center gap-1">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     Clear All Filters
                  </span>
                </Link>
             </div>
          )}
        </div>

        {/* Main Product Area */}
        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-200">
              {error?.data?.message || error.error}
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center text-slate-600 dark:text-slate-400">
                <div>
                  {data.count === 0 ? 'No' : data.count} Results
                  {keyword !== '' && ` for "${keyword}"`}
                  {category !== 'all' && ` in ${category}`}
                  {price !== 'all' && ` : Price ${price}`}
                  {rating !== 'all' && ` : Rating ${rating} & up`}
                </div>
              </div>
              
              {data.products.length === 0 && (
                 <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h2>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filter to find what you're looking for.</p>
                 </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>

              {data.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex gap-2">
                    {[...Array(data.pages).keys()].map((x) => (
                      <Link 
                        key={x + 1} 
                        to={getFilterUrl({ page: x + 1 })}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors border ${
                          Number(pageNumber) === x + 1
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {x + 1}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;

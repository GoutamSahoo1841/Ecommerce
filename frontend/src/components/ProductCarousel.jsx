import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-8">
        {error?.data?.message || error.error || 'An error occurred'}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl mb-12 h-[300px] md:h-[400px] lg:h-[500px] group">
      {products.map((product, index) => (
        <div
          key={product._id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Link to={`/product/${product._id}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 w-full md:w-2/3">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {product.name}
              </h2>
              <p className="text-xl md:text-2xl font-bold text-primary mb-6 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                ${product.price}
              </p>
            </div>
          </Link>
        </div>
      ))}
      
      <div className="absolute bottom-6 right-6 md:right-12 z-20 flex space-x-3">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;

import React from 'react';

const products = [
  { _id: '1', name: 'Airpods Wireless Bluetooth Headphones', image: 'https://images.unsplash.com/photo-1606220588913-b3aec44eb5b1?w=800&q=80', description: 'Bluetooth technology lets you connect it with compatible devices wirelessly.', brand: 'Apple', category: 'Electronics', price: 89.99, countInStock: 10, rating: 4.5, numReviews: 12 },
  { _id: '2', name: 'iPhone 13 Pro 256GB Memory', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80', description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system.', brand: 'Apple', category: 'Electronics', price: 599.99, countInStock: 7, rating: 4.0, numReviews: 8 },
  { _id: '3', name: 'Cannon EOS 80D DSLR Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', description: 'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself.', brand: 'Cannon', category: 'Electronics', price: 929.99, countInStock: 5, rating: 3.5, numReviews: 12 },
  { _id: '4', name: 'Sony Playstation 5', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80', description: 'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming or movies.', brand: 'Sony', category: 'Electronics', price: 399.99, countInStock: 11, rating: 5, numReviews: 12 },
];

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
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-primary shadow-sm">
                ${product.price}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
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

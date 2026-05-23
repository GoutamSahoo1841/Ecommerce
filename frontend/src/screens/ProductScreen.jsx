import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetProductDetailsQuery,
  useCreateProductReviewMutation,
  useGetRelatedProductsQuery,
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { addRecentlyViewed } from '../slices/recentlyViewedSlice';
import Meta from '../components/Meta';
import Product from '../components/Product';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeImage, setActiveImage] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const { data: relatedProducts, isLoading: loadingRelated } = useGetRelatedProductsQuery(productId);

  const [createProductReview, { isLoading: loadingProductReview }] = useCreateProductReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (product) {
      dispatch(addRecentlyViewed({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        rating: product.rating,
        numReviews: product.numReviews,
      }));
    }
  }, [dispatch, product]);

  const existInWishlist = wishlistItems.find((x) => x._id === product?._id);

  const toggleWishlistHandler = () => {
    if (existInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createProductReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      alert('Review Submitted');
      setRating(0);
      setComment('');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
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

  const displayImage = activeImage || product.image;
  const allImages = [product.image, ...(product.images || [])];

  return (
    <div>
      <Meta title={product.name} description={product.description} />
      <Link to="/" className="inline-flex items-center gap-2 mb-8 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Go Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Product Image Gallery */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 aspect-square flex items-center justify-center p-6">
            <img src={displayImage} alt={product.name} className="w-full h-auto object-cover rounded-2xl hover:scale-105 transition-transform duration-500" />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    displayImage === img 
                      ? 'border-primary shadow-md' 
                      : 'border-transparent opacity-70 hover:opacity-100 bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:col-span-1 flex flex-col justify-center relative">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{product.brand}</p>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight pr-12">
              {product.name}
            </h1>
            <button 
              onClick={toggleWishlistHandler}
              className="absolute top-0 right-0 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors"
              title={existInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <svg className="w-8 h-8" fill={existInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
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

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Reviews</h2>
        {product.reviews.length === 0 && (
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-6 rounded-2xl">
            No Reviews
          </div>
        )}
        <div className="space-y-6 mt-6">
          {product.reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <strong className="text-lg text-slate-900 dark:text-white">{review.name}</strong>
                <div className="flex text-yellow-400 text-sm">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-4">{review.createdAt.substring(0, 10)}</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>
            </div>
          ))}

          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Write a Customer Review</h2>
            {loadingProductReview && (
              <div className="flex justify-center items-center py-4 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                  <select 
                    id="rating"
                    required
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Comment</label>
                  <textarea 
                    id="comment"
                    required
                    row="3" 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  ></textarea>
                </div>
                <button type="submit" disabled={loadingProductReview} className="btn-primary py-3 px-8">
                  Submit
                </button>
              </form>
            ) : (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-6 rounded-2xl">
                Please <Link to="/login" className="font-bold hover:underline">sign in</Link> to write a review
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20 mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            You Might Also <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Like</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Product key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;

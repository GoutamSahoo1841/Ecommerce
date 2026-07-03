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
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Star, 
  Check, 
  Plus, 
  Minus,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'reviews'
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const { data: relatedProducts } = useGetRelatedProductsQuery(productId);

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
      // Reset active image on product change
      setActiveImage(product.image);
      setQty(1);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    }
  }, [dispatch, product]);

  const existInWishlist = wishlistItems.some((x) => x._id === product?._id);

  const toggleWishlistHandler = (e) => {
    e.preventDefault();
    if (existInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty, selectedColor, selectedSize }));
    toast.success(`Added ${qty} ${product.name} to cart`);
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
      toast.success('Review Submitted successfully');
      setRating(5);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-[50vh] text-muted-foreground text-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        Loading Product Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-2xl border border-destructive/20 text-sm">
        {error?.data?.message || error.error || 'An error occurred'}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
        <Button asChild>
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  const displayImage = activeImage || product.image;
  const allImages = [product.image, ...(product.images || [])];
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="space-y-12">
      <Meta title={product.name} description={product.description} />
      
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Product Image Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden bg-card border border-border/50 shadow-md aspect-square flex items-center justify-center p-8 relative">
            <img 
              src={displayImage} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-2xl select-none" 
            />
            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-6 left-6 shadow-md border-none font-bold py-1 bg-rose-500 text-white">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    displayImage === img 
                      ? 'border-primary shadow-sm' 
                      : 'border-transparent opacity-70 hover:opacity-100 bg-secondary/30'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Action Card */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none py-1">
                {product.brand}
              </Badge>
              <button 
                onClick={toggleWishlistHandler}
                className={`p-2.5 rounded-full border border-border/50 transition-colors bg-card hover:bg-secondary/40 shadow-sm focus:outline-none ${
                  existInWishlist ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'
                }`}
                title={existInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${existInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Ratings Header */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-foreground ml-1">{product.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-sm text-muted-foreground">{product.numReviews} ratings</span>
            </div>

            {/* Pricing details */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-foreground">${product.price}</span>
              {hasDiscount && (
                <span className="text-base text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed text-base">
              {product.description}
            </p>

            {/* Colors Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Color: <span className="text-foreground font-bold">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedColor === c
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                          : 'bg-card border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Size: <span className="text-foreground font-bold">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSize === s
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                          : 'bg-card border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Box Card */}
          <Card className="shadow-md">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Availability</span>
                <span className={`font-bold flex items-center gap-1.5 ${
                  product.countInStock > 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {product.countInStock > 0 ? (
                    <>
                      <Check className="h-4 w-4" />
                      In Stock
                    </>
                  ) : 'Out of Stock'}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      disabled={qty <= 1}
                      className="h-8 w-8 rounded-lg"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold text-foreground">{qty}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQty((prev) => Math.min(product.countInStock, prev + 1))}
                      disabled={qty >= product.countInStock}
                      className="h-8 w-8 rounded-lg"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              <Button 
                disabled={product.countInStock === 0}
                className="w-full shadow-md py-6 rounded-xl font-bold flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary/95 text-base h-12"
                onClick={addToCartHandler}
              >
                <ShoppingBag className="h-5 w-5" />
                Add To Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section for Description & Reviews */}
      <div className="space-y-6 pt-8 border-t border-border/50">
        <div className="flex border-b border-border/50 gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-base font-bold transition-all relative ${
              activeTab === 'description' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Product Details
            {activeTab === 'description' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-base font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Reviews</span>
            <Badge variant="secondary" className="px-2 py-0.5 text-[10px] bg-secondary text-muted-foreground">
              {product.reviews.length}
            </Badge>
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'description' ? (
          <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm leading-relaxed space-y-4">
            <h3 className="text-foreground font-bold text-lg flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Specifications & Info
            </h3>
            <p>This premium {product.name} is engineered to deliver unmatched durability and peak output. Built with eco-friendly components and designed by the hardware experts at {product.brand}.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li>Stock Units Available: {product.countInStock}</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              {product.reviews.length === 0 ? (
                <div className="text-muted-foreground text-sm flex flex-col items-center justify-center p-8 bg-secondary/10 rounded-2xl border border-border/50 text-center">
                  <MessageSquare className="h-8 w-8 mb-2 text-muted-foreground/30" />
                  No reviews yet. Be the first to review this product!
                </div>
              ) : (
                product.reviews.map((review) => (
                  <Card key={review._id} className="shadow-sm">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <strong className="text-foreground text-sm sm:text-base">{review.name}</strong>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3.5 w-3.5 ${
                                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{review.createdAt.substring(0, 10)}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Create review form */}
            <Card className="bg-secondary/10 shadow-sm border-border/50">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Write a Customer Review
                </h3>
                
                {loadingProductReview && (
                  <div className="flex justify-center items-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
                
                {userInfo ? (
                  <form onSubmit={submitHandler} className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="rating" className="block text-xs font-semibold text-muted-foreground">Rating</label>
                      <select 
                        id="rating"
                        required
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full bg-card border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="comment" className="block text-xs font-semibold text-muted-foreground">Comment</label>
                      <textarea 
                        id="comment"
                        required
                        rows="3" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review here..."
                        className="w-full bg-card border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                      />
                    </div>
                    <Button type="submit" disabled={loadingProductReview} className="rounded-xl h-11 text-white font-semibold">
                      Submit Review
                    </Button>
                  </form>
                ) : (
                  <div className="bg-primary/5 text-primary p-4 rounded-2xl border border-primary/10 text-sm">
                    Please <Link to="/login" className="font-bold underline hover:text-primary/80">sign in</Link> to write a review.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            You Might Also <span className="text-primary">Like</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct, idx) => (
              <Product key={relatedProduct._id} product={relatedProduct} index={idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductScreen;

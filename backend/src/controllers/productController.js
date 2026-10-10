import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { getCache, setCache, clearCachePattern } from '../config/redis.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
// GET /api/products?keyword=phone&category=Electronics&rating=4&price=500-2000&sort=priceAsc&pageNumber=2
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT || 10; // Number of products to display in one page
  const page = Number(req.query.pageNumber) || 1; 

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword, //It allows pattern matching
          $options: 'i', // i means case-insensitive. like iphone,IPHONE,iPhone,IpHoNe
        },
      }
    : {};

  const category = req.query.category && req.query.category !== 'all' ? { category: req.query.category } : {};
  const rating = req.query.rating && req.query.rating !== 'all' ? { rating: { $gte: Number(req.query.rating) } } : {};
  const price = req.query.price && req.query.price !== 'all' ? { 
    price: { 
      $gte: Number(req.query.price.split('-')[0]), 
      $lte: Number(req.query.price.split('-')[1]) 
    } 
  } : {};
  
  const deals = req.query.deals === 'true' ? {
    originalPrice: { $gt: 0 },
    $expr: { $gt: ["$originalPrice", "$price"] }
  } : {};

  const filter = { ...keyword, ...category, ...rating, ...price, ...deals };

  let sortObj = {};
  if (req.query.sort === 'newest') {
    sortObj = { createdAt: -1 }; //-1 means descending order
  } else if (req.query.sort === 'priceAsc') {
    sortObj = { price: 1 }; //1 means ascending.
  } else if (req.query.sort === 'priceDesc') {
    sortObj = { price: -1 };
  } else if (req.query.sort === 'rating') {
    sortObj = { rating: -1 };
  } else {
    sortObj = { createdAt: -1 }; // default
  }

  // Check Redis Cache
  const cacheKey = `products:list:${JSON.stringify(req.query)}`; //The purpose is to create a unique cache key for each different query.
  const cachedProducts = await getCache(cacheKey);
  if (cachedProducts) {
    return res.json(cachedProducts);
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortObj)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const responseData = { products, page, pages: Math.ceil(count / pageSize), count };
  await setCache(cacheKey, responseData, 5 * 60 * 60); // 5 hours cache

  res.json(responseData);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const cacheKey = `products:detail:${req.params.id}`;
  const cachedProduct = await getCache(cacheKey);
  if (cachedProduct) {
    return res.json(cachedProduct);
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    await setCache(cacheKey, product, 5 * 60 * 60); // 5 hours cache
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    images: [],
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    badge: '',
    colors: [],
    sizes: [],
  });

  const createdProduct = await product.save();
  await clearCachePattern('products:*');
  await clearCachePattern('dashboard:*');
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    originalPrice,
    description,
    image,
    images,
    brand,
    category,
    countInStock,
    badge,
    colors,
    sizes,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
    product.description = description || product.description;
    product.image = image || product.image;
    if (images) {
      product.images = images;
    }
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.badge = badge !== undefined ? badge : product.badge;
    if (colors) {
      product.colors = colors;
    }
    if (sizes) {
      product.sizes = sizes;
    }

    const updatedProduct = await product.save();
    await clearCachePattern('products:*');
    await clearCachePattern('dashboard:*');
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    await clearCachePattern('products:*');
    await clearCachePattern('dashboard:*');
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => { //asyncHandler automatically forwards errors to your global Express error middleware.
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    await clearCachePattern('products:*');
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5);

  res.json(products);
});

// @desc    Get all product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  const cacheKey = 'products:categories';
  const cachedCategories = await getCache(cacheKey);
  if (cachedCategories) {
    return res.json(cachedCategories);
  }

  const categories = await Product.find().distinct('category');
  await setCache(cacheKey, categories, 5 * 60 * 60); // 5 hours cache
  res.json(categories);
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const relatedProducts = await Product.find({
      _id: { $ne: product._id }, // Exclude current product
      category: product.category, // Must match same category
    }).limit(10);

    res.json(relatedProducts);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getProductCategories,
  getRelatedProducts,
};

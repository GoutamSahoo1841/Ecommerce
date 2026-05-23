# 60-Day eCommerce Project

Welcome to my 60-Day eCommerce Project! This repository tracks my daily progress in building an industry-level eCommerce website using the MERN stack (MongoDB, Express, React, Node.js).

## Project Roadmap

*   **Phase 1: Setup + Backend Foundations (Day 1–10)**: Project setup, Server, Database, User Auth.
*   **Phase 2: Core MVP Backend (Day 11–20)**: Product APIs, Cart logic, Orders, Admin APIs.
*   **Phase 3: Frontend Core (Day 21–35)**: React + Tailwind, Routing, Auth UI, Product Listing/Detail, Cart/Checkout UI.
*   **Phase 4: Intermediate Features (Day 36–50)**: Payment Integration, Order Tracking, Reviews, Admin Dashboard.
*   **Phase 5: Advanced + Resume Boosters (Day 51–60)**: State Management, Image Uploads, Live Updates, SEO, Deployment.

## Progress Log

### Day 1
- [x] Initialized Git repository
- [x] Created basic folder structure (frontend, backend)
- [x] Created initial README.md

### Day 2
- [x] Initialized Node.js project in backend
- [x] Installed backend dependencies (Express, Mongoose, dotenv, cors, nodemon)
- [x] Set up basic Express server using ES modules and connected to MongoDB

### Day 3
- [x] Installed authentication dependencies (bcryptjs, jsonwebtoken, express-async-handler)
- [x] Created User Mongoose model with password hashing methods
- [x] Implemented authentication and registration routes/controllers
- [x] Added custom error handling middleware

### Day 4
- [x] Created auth middleware to protect routes (JWT verification)
- [x] Added admin middleware for role-based access control
- [x] Implemented get and update user profile controllers
- [x] Secured API routes with protect and admin middlewares

### Day 5
- [x] Implemented delete user controller for admin access
- [x] Implemented get user by ID controller for admin access
- [x] Implemented update user controller (admin functionality)
- [x] Secured and integrated all admin user routes (`DELETE /api/users/:id`, `GET /api/users/:id`, `PUT /api/users/:id`)

### Day 6
- [x] Created `Product` Mongoose model with review schema
- [x] Created `Order` Mongoose model with nested schemas (order items, shipping address)
- [x] Created mock data for users and products
- [x] Implemented database seeder script (`seeder.js`) to import and destroy data

### Day 7
- [x] Implemented `productController.js` to fetch products from the database
- [x] Created `productRoutes.js` for `GET /api/products` and `GET /api/products/:id` endpoints
- [x] Integrated product routes into Express application

### Day 8
- [x] Implemented `createProduct`, `updateProduct`, and `deleteProduct` in `productController.js`
- [x] Secured product mutation routes using `protect` and `admin` middleware
- [x] Wired up `POST /api/products`, `PUT /api/products/:id`, and `DELETE /api/products/:id` endpoints

### Day 9
- [x] Implemented `createProductReview` controller to allow users to review products
- [x] Implemented `getTopProducts` controller for fetching top-rated products
- [x] Added keyword search functionality to `getProducts`
- [x] Added pagination feature to `getProducts` controller
- [x] Integrated new product endpoints into `productRoutes.js`

### Day 10
- [x] Implemented `orderController` to manage orders (create, get by ID, update to paid/delivered, get user orders, get all orders)
- [x] Implemented `orderRoutes` with protected and admin-only endpoints
- [x] Wired up `orderRoutes` in the main application `app.js`
- [x] Completed Core MVP Backend for Orders

### Day 11
- [x] Installed `multer` for handling multipart/form-data
- [x] Implemented `uploadRoutes` to allow image uploads to the server
- [x] Added `/api/config/paypal` endpoint to serve PayPal client ID to the frontend
- [x] Configured Express to serve the `/uploads` directory statically

### Day 12
- [x] Initialized React frontend application using Vite
- [x] Installed base frontend dependencies

### Day 13
- [x] Installed and configured Tailwind CSS for styling
- [x] Setup React Router (`react-router-dom`) for frontend navigation
- [x] Built the core `App.jsx` layout with premium glassmorphism Header and Footer components
- [x] Implemented a visually stunning `HomeScreen` to display mock product cards

### Day 14
- [x] Extracted mock data to `products.js` to share across components
- [x] Created `ProductScreen.jsx` with a premium, responsive layout for individual product details
- [x] Implemented dynamic routing (`/product/:id`) in `main.jsx`
- [x] Wired up product cards on the `HomeScreen` to navigate to the `ProductScreen`

### Day 15
- [x] Installed `axios` to make HTTP requests from the frontend
- [x] Configured Vite proxy in `vite.config.js` to route `/api` and `/uploads` requests to the backend server
- [x] Replaced mock data with real data fetching in `HomeScreen.jsx` using `useEffect` and `useState`
- [x] Added premium loading spinners and error states to `HomeScreen.jsx`
- [x] Implemented single product data fetching in `ProductScreen.jsx` with loading/error states

### Day 16
- [x] Installed `@reduxjs/toolkit` and `react-redux` for global state management
- [x] Configured the global Redux store (`store.js`) and provided it in `main.jsx`
- [x] Built the base RTK Query API slice (`apiSlice.js`)
- [x] Created `productsApiSlice.js` to manage `/api/products` data fetching and caching
- [x] Refactored `HomeScreen.jsx` and `ProductScreen.jsx` to use auto-generated RTK Query hooks instead of standard `useEffect`/`axios` calls

### Day 17
- [x] Created `cartSlice.js` to manage standard Redux cart state (addToCart, removeFromCart)
- [x] Built `cartUtils.js` to calculate item, shipping, and tax prices, and to persist the cart to `localStorage`
- [x] Added dynamic quantity selector and "Add To Cart" functionality to `ProductScreen.jsx`
- [x] Built a premium `CartScreen.jsx` UI to view, edit, and remove cart items
- [x] Wired up the `Header.jsx` navigation bar to dynamically display a cart badge tied to the Redux store

### Day 18
- [x] Created `authSlice.js` to manage user credentials in Redux and `localStorage`
- [x] Created `usersApiSlice.js` to connect the frontend to the backend `/api/users` routes via RTK Query
- [x] Built a reusable `FormContainer.jsx` wrapper for authentication and checkout flows
- [x] Implemented a premium `LoginScreen.jsx` UI with loading states and error handling
- [x] Refactored `Header.jsx` to dynamically render user information and a logout dropdown menu

### Day 19
- [x] Created `RegisterScreen.jsx` using the reusable `FormContainer`
- [x] Integrated `useRegisterMutation` from `usersApiSlice` to register new users
- [x] Implemented password confirmation validation on the frontend
- [x] Configured automatic login (`setCredentials`) and redirect upon successful registration

### Day 20
- [x] Added `profile` endpoint mutation to `usersApiSlice.js`
- [x] Built a premium `ProfileScreen.jsx` to allow authenticated users to update their details
- [x] Added `/profile` route to React Router configuration in `main.jsx`
- [x] Implemented backend dummy `logoutUser` controller and `/logout` route to resolve 404s
- [x] Completed Core Frontend Authentication Flow

### Day 21
- [x] Added `saveShippingAddress` reducer to `cartSlice.js` and local storage persistence
- [x] Created `PrivateRoute.jsx` component to protect checkout and profile routes
- [x] Created a premium `CheckoutSteps.jsx` progress indicator component
- [x] Built `ShippingScreen.jsx` to collect and validate the user's delivery address
- [x] Updated React Router in `main.jsx` to enforce `PrivateRoute` on `/shipping` and `/profile`

### Day 22
- [x] Added `savePaymentMethod` and `clearCartItems` to `cartSlice.js`
- [x] Implemented `ordersApiSlice.js` with `createOrder` endpoint
- [x] Created `PaymentScreen.jsx` to allow users to select their payment method
- [x] Built a comprehensive `PlaceOrderScreen.jsx` UI to review order details and place the order
- [x] Updated React Router to protect the new `/payment` and `/placeorder` routes

### Day 23
- [x] Added `getOrderDetails` query to `ordersApiSlice.js`
- [x] Created a premium `OrderScreen.jsx` UI to display shipping, payment, and item details for a specific order
- [x] Integrated dynamic status alerts for payment (`isPaid`) and delivery (`isDelivered`) statuses
- [x] Updated React Router to protect the new `/order/:id` route

### Day 24
- [x] Installed `@paypal/react-paypal-js` to implement official PayPal buttons
- [x] Added `payOrder` mutation and `getPayPalClientId` query to `ordersApiSlice.js`
- [x] Wrapped the frontend application in `PayPalScriptProvider` for dynamic script loading
- [x] Implemented PayPal buttons in `OrderScreen.jsx` that trigger the backend payment update upon successful transaction

### Day 25
- [x] Added `getMyOrders` query to `ordersApiSlice.js` to fetch a user's past orders
- [x] Refactored `ProfileScreen.jsx` to execute the query and replace the placeholder
- [x] Built a responsive data table to display order ID, date, total, and visual status indicators (paid/delivered)
- [x] Wired up a "Details" link on each row to route directly to the specific `/order/:id` screen

### Day 26
- [x] Created `AdminRoute.jsx` component to protect admin-only routes
- [x] Added `getOrders` and `deliverOrder` endpoints to `ordersApiSlice.js`
- [x] Created `OrderListScreen.jsx` for admins to view and manage all orders
- [x] Updated `Header.jsx` to include an Admin dropdown menu for authenticated admin users
- [x] Added "Mark As Delivered" functionality to `OrderScreen.jsx` for admins

### Day 27
- [x] Added `createProduct` and `deleteProduct` mutations to `productsApiSlice.js`
- [x] Created `ProductListScreen.jsx` for admins to view all products
- [x] Implemented "Create Product" and "Delete Product" functionalities in `ProductListScreen.jsx`
- [x] Registered `/admin/productlist` route in `main.jsx`

### Day 28
- [x] Added `updateProduct` and `uploadProductImage` mutations to `productsApiSlice.js`
- [x] Created `ProductEditScreen.jsx` UI to allow admins to edit product details
- [x] Integrated image upload functionality to send files to the backend `/api/upload` endpoint
- [x] Registered `/admin/product/:id/edit` route in `main.jsx`

### Day 29
- [x] Added `getUsers` and `deleteUser` endpoints to `usersApiSlice.js`
- [x] Created `UserListScreen.jsx` for admins to view and manage all users
- [x] Implemented delete user functionality with a confirmation prompt
- [x] Registered `/admin/userlist` route in `main.jsx`

### Day 30
- [x] Added `getUserDetails` query and `updateUser` mutation to `usersApiSlice.js`
- [x] Created `UserEditScreen.jsx` UI to allow admins to edit user details (Name, Email, isAdmin)
- [x] Integrated auto-population of existing user data into the edit form
- [x] Registered `/admin/user/:id/edit` route in `main.jsx`

### Day 31
- [x] Updated `productsApiSlice.js` to accept `keyword` and `pageNumber` query parameters
- [x] Created `SearchBox.jsx` component and integrated it into `Header.jsx` for product searching
- [x] Created a dynamic `Paginate.jsx` component to handle frontend pagination
- [x] Updated `HomeScreen.jsx` to parse search keywords and page numbers from the URL and pass them to the query
- [x] Integrated pagination into the admin `ProductListScreen.jsx`
- [x] Registered all new search and pagination routes in `main.jsx`

### Day 32
- [x] Installed `react-helmet-async` for managing document head metadata
- [x] Created `Meta.jsx` component for dynamic SEO titles, descriptions, and keywords
- [x] Wrapped the application in `<HelmetProvider>` within `main.jsx`
- [x] Created `ProductCarousel.jsx` component to dynamically feature top-rated products
- [x] Added `getTopProducts` query and `createProductReview` mutation to `productsApiSlice.js`
- [x] Integrated the `ProductCarousel` into the `HomeScreen.jsx`
- [x] Implemented a Customer Reviews section with a secure submission form in `ProductScreen.jsx`

### Day 33
- [x] Prepared the application for production deployment
- [x] Updated `backend/src/app.js` to serve frontend static build files when `NODE_ENV` is set to `production`
- [x] Created a root `package.json` to manage cross-repository dependencies and root-level build commands
- [x] Installed `concurrently` for running backend and frontend dev servers simultaneously from the root directory
- [x] Added deployment scripts (`npm run build`) to automatically install frontend packages and generate the optimized production build
- [x] Resolved component import warnings and ensured zero-error builds across the frontend

### Day 34
- [x] Integrated `recharts` for scalable SVG data visualization
- [x] Created `getDashboardData` controller to aggregate totals (Users, Orders, Revenue) and summarize sales by date via MongoDB aggregations
- [x] Added `getDashboardData` to the `ordersApiSlice.js`
- [x] Developed the `DashboardScreen.jsx` with summary cards, a Sales History Line Chart, and a Product Categories Pie Chart
- [x] Registered the `/admin/dashboard` protected route and added a quick-link inside the Admin dropdown

### Day 35
- [x] Created `wishlistSlice.js` utilizing Redux Toolkit to manage wishlist state globally
- [x] Implemented `localStorage` persistence so users retain their saved items across sessions
- [x] Upgraded `ProductScreen.jsx` with a dynamic, toggleable heart icon for adding/removing items
- [x] Built `WishlistScreen.jsx` to render saved items in a clean grid, complete with "Add to Cart" integration
- [x] Registered the `/wishlist` route and added a dynamic Wishlist badge to the navigation `Header.jsx`

### Day 36
- [x] Installed `socket.io` in the backend and configured it to attach to the Express HTTP server
- [x] Updated `orderController.js` to emit a `newOrder` event to the `admin` room whenever a new order is successfully processed
- [x] Installed `socket.io-client` and `react-toastify` in the frontend
- [x] Integrated WebSockets in `App.jsx` to automatically connect and join the `admin` room if the logged-in user is an administrator
- [x] Implemented real-time popup toast notifications alerting admins globally when a new customer places an order

### Day 37
- [x] Upgraded the backend `getProducts` controller to parse and execute complex MongoDB queries for Categories, Price Ranges, and Customer Ratings
- [x] Added a `getProductCategories` endpoint to dynamically fetch all unique product categories stored in the database
- [x] Re-engineered frontend routing to map `/search` to a brand-new, dedicated `SearchScreen.jsx` component
- [x] Developed an Advanced Search Sidebar featuring dynamic URL query parameters for instantaneous, multi-faceted filtering
- [x] Cleaned up `HomeScreen.jsx` to serve purely as an elegant landing page
- [x] Extracted product layout into a reusable `Product.jsx` component to optimize architecture and resolve Vite HMR caching

### Day 38
- [x] Integrated `nodemailer` into the backend for SMTP email delivery
- [x] Upgraded the `User` MongoDB model with `resetPasswordToken` and `resetPasswordExpire` fields along with a built-in cryptographic token generator
- [x] Developed robust `forgotPassword` and `resetPassword` controllers mimicking production-grade security standards
- [x] Created `sendEmail.js` utility utilizing Nodemailer's Ethereal Email to generate mock SMTP credentials for local testing
- [x] Built `ForgotPasswordScreen.jsx` and `ResetPasswordScreen.jsx` in React and linked them up via `react-router-dom`
- [x] Updated RTK Query API Slices to seamlessly handle the new password reset endpoints

### Day 39
- [x] Upgraded the `Product` MongoDB schema to natively support an `images` array for multiple product shots
- [x] Configured Multer in `uploadRoutes.js` to process batch file uploads via a new `/multiple` endpoint
- [x] Enhanced `ProductEditScreen.jsx` UI to allow Admins to natively drag-and-drop multiple images into an organized gallery
- [x] Transformed `ProductScreen.jsx` to render an interactive thumbnail gallery allowing users to instantly swap product images

### Day 40
- [x] Engineered a dynamic `Coupon` schema natively bound to the MongoDB database
- [x] Established robust coupon management APIs complete with discount validation and expiration tracking
- [x] Overhauled the Redux Toolkit cart logic to dynamically compute price adjustments against running subtotals before calculating taxes
- [x] Transformed `CartScreen.jsx` UI to support a real-time promo code input with instantaneous visual feedback via `react-toastify`

### Day 53
- [x] Installed `cloudinary` and `multer-storage-cloudinary` to scale backend storage
- [x] Refactored `uploadRoutes.js` to automatically intercept Multer streams and pipe them to the Cloudinary CDN
- [x] Configured Cloudinary SDK to process both single and batch image uploads seamlessly


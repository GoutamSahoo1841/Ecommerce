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

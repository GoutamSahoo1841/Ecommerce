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

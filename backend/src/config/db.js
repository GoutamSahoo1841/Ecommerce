import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import users from '../data/users.js';
import products from '../data/products.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed default users and products if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Seeding default users...');
      const createdUsers = await User.insertMany(users);
      console.log('Default users seeded successfully!');

      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log('Seeding default products...');
        const adminUser = createdUsers.find((u) => u.isAdmin);
        const adminId = adminUser ? adminUser._id : createdUsers[0]._id;
        const sampleProducts = products.map((product) => {
          return { ...product, user: adminId };
        });
        await Product.insertMany(sampleProducts);
        console.log('Default products seeded successfully!');
      }
    }
    // Ensure all admin users defined in code exist in the database
    const adminUsers = users.filter((u) => u.isAdmin);
    for (const adminData of adminUsers) {
      const exists = await User.findOne({ email: adminData.email });
      if (!exists) {
        console.log(`Admin user ${adminData.email} not found in database. Seeding...`);
        await User.insertMany([adminData]);
        console.log(`Admin user ${adminData.email} seeded successfully!`);
      }
    }

    // Ensure all users in database have properly hashed passwords
    const allUsers = await User.find({});
    for (const user of allUsers) {
      if (
        user.password &&
        !(
          user.password.startsWith('$2a$') ||
          user.password.startsWith('$2b$') ||
          user.password.startsWith('$2y$')
        )
      ) {
        console.log(`User ${user.email} has plain text password. Hashing...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        await User.updateOne({ _id: user._id }, { password: hashedPassword });
        console.log(`User ${user.email} password hashed and updated.`);
      }
    }
  } catch (error) {
    console.error(`Error: Could not connect to MongoDB database. Detail: ${error.message}`);
    console.error('If you are using MongoDB Atlas, make sure your current IP address is whitelisted in your cluster Network Access settings.');
  }
};

export default connectDB;

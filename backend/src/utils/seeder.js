import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Product from '../models/Product.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};


const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Beauty',
];

const brands = [
  'Apple',
  'Samsung',
  'Nike',
  'Adidas',
  'Sony',
  'Dell',
  'HP',
  'LG',
  'Canon',
  'Puma',
];

const randomItem = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min, max) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));


const importData = async () => {
  try {
    await connectDB();

    console.log('🗑 Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();

    console.log('👤 Creating users...');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user1234',
      role: 'user',
    });

    console.log('📦 Creating products...');

    const categoryPrices = {
      'Electronics':  { min: 4999,  max: 149999 },
      'Clothing':     { min: 299,   max: 9999   },
      'Books':        { min: 99,    max: 1999   },
      'Home & Garden':{ min: 499,   max: 29999  },
      'Sports':       { min: 299,   max: 49999  },
      'Toys':         { min: 199,   max: 9999   },
      'Beauty':       { min: 99,    max: 4999   },
    };

    const products = Array.from({ length: 50 }, (_, i) => {
      const category = randomItem(categories);
      const brand    = randomItem(brands);
      const { min, max } = categoryPrices[category];
      return {
        name:        `${brand} Product ${i + 1}`,
        description: `High-quality ${category.toLowerCase()} product from ${brand}. Excellent performance and value for money.`,
        price:       randomInt(min, max),
        category,
        brand,
        stock:       randomInt(0, 100),
        rating:      randomFloat(1, 5),
        numReviews:  randomInt(0, 500),
        images:      [`https://picsum.photos/seed/${i + 1}/400/300`],
        createdBy:   admin._id,
      };
    });

    await Product.insertMany(products);

    console.log('Data imported successfully!');
    console.log('Admin → admin@example.com / admin123');
    console.log('User  → user@example.com  / user1234');

    process.exit();
  } catch (error) {
    console.error(' Import failed:', error.message);
    process.exit(1);
  }
};


const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    console.log('🗑 Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Destroy failed:', error.message);
    process.exit(1);
  }
};


if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
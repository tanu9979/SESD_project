import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT || '5001'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/folio_db',
  JWT_SECRET: process.env.JWT_SECRET || 'folio_dev_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export default env;

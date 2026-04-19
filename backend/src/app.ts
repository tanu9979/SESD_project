import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { general } from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import env from './config/env';

import authRoutes     from './routes/auth.routes';
import bookRoutes     from './routes/book.routes';
import cartRoutes     from './routes/cart.routes';
import addressRoutes  from './routes/address.routes';
import orderRoutes    from './routes/order.routes';
import paymentRoutes  from './routes/payment.routes';
import rentalRoutes   from './routes/rental.routes';
import ratingRoutes   from './routes/rating.routes';
import chatRoutes     from './routes/chat.routes';
import feedbackRoutes from './routes/feedback.routes';
import adminRoutes    from './routes/admin.routes';
import utilityRoutes  from './routes/utility.routes';

const app = express();

app.use(helmet());

const allowedOrigins = [
  env.FRONTEND_URL.replace(/\/$/, ''),
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(general);

app.get('/', (_req, res) => res.json({ status: 'ok', app: 'Folio API' }));

app.use('/api/auth',      authRoutes);
app.use('/api/books',     bookRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api/rentals',   rentalRoutes);
app.use('/api/ratings',   ratingRoutes);
app.use('/api/chat',      chatRoutes);
app.use('/api/feedback',  feedbackRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api',           utilityRoutes);

app.use(errorHandler);

export default app;

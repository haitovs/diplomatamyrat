import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler, notFound } from './middleware/error.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import categoriesRouter from './routes/categories.js';
import favoritesRouter from './routes/favorites.js';
import ordersRouter from './routes/orders.js';
import productsRouter from './routes/products.js';
import settingsRouter from './routes/settings.js';
import uploadRouter from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:5174'],
  credentials: true
}));

// Serve uploaded files - resolve to project root
const projectRoot = path.resolve(__dirname, '..', '..');
app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));
console.log('Static uploads served from:', path.join(projectRoot, 'uploads'));

// IMPORTANT: Upload routes MUST come BEFORE express.json()
// express.json() consumes the raw body, breaking multipart/form-data parsing
app.use('/api/upload', uploadRouter);

// JSON body parser - AFTER upload routes
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    name: 'Hearth & Home API',
    version: '1.0.0',
    status: 'ok'
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', adminRouter);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const publicDir = path.resolve(__dirname, '../../public');
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🏠 Hearth & Home API running at http://localhost:${PORT}`);
});

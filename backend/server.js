import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

import { testConnection } from './config/db.js';
import ensureProjectTables from './config/ensureProjectTables.js';
import projectRoutes from './routes/projects.js';
import ensureResourceTables from './config/ensureResourceTables.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import kitRoutes from './routes/kits.js';
import testimonialRoutes from './routes/testimonials.js';
import adminRoutes from './routes/admin.js';
import resourceRoutes from './routes/resources.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://www.sunlink-power.com', 
  'https://sunlink-power.com', 
  'http://localhost:5173'
];
// CORS configuration
const  corsOptions = {
   origin :  function  ( origin, callback )  {
    if  (!origin)  return  callback( null ,  true );
    
    if  (allowedOrigins.indexOf(origin) !== - 1 ) {
      callback( null ,  true );
    }  else  {
      console.log('blocked url:', origin)
      callback( new Error ( 'Not allowed by CORS' ));
    }
  },
   credentials :  true ,
   optionsSuccessStatus :  200 
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sunlink Power API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/projects', projectRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Sunlink Power API',
    version: '1.0.0',
    endpoints: {
      categories: '/api/categories',
      products: '/api/products',
      resources: '/api/resources',
      testimonials: '/api/testimonials',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    await ensureResourceTables();
    await ensureProjectTables();

    // Start listening
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 Sunlink Power API Server`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      console.log(`📚 Health Check: http://localhost:${PORT}/health`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();

export default app;

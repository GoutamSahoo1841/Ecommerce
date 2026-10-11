import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import monitoringMiddleware from './middleware/monitoring.js';

const app = express();

// Express 5 compatibility: make req.query writable.
//We create a copy of the original req.query and then replace req.query with that copy. This new req.query is made writable, so subsequent middleware can modify or sanitize it.
app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true, //This means the req.query property can be changed/reassigned.
      configurable: true,  //This means the property can later be modified or deleted.
      enumerable: true,  //This means the property behaves normally when JavaScript enumerates the object's properties.
    });
  }
  next();
});

// Security: It adds security-related HTTP headers to the server's response, which instruct the browser to handle the response more securely.
app.use(helmet()); 

// Cross Origin Resource Sharing. It controls which frontend origins are allowed to communicate with your backend from a browser.
app.use(cors());

// Body parser. Converts incoming JSON request bodies into JavaScript objects.
app.use(express.json());

// Security: Sanitize data to prevent NoSQL Operator Injection. For example, malicious input might try to use MongoDB operators like $gt or $ne to manipulate queries. This middleware removes any keys that start with '$' or contain '.' from the request body, query, and params.
app.use(mongoSanitize());

// Security: Prevent HTTP Parameter Pollution. It handles duplicate query parameters.
app.use(hpp());

// API Performance Monitoring: Track response telemetry for API Monitoring System
app.use(monitoringMiddleware({
  serviceName: process.env.SERVICE_NAME || 'E-commerce',
  apiKey: process.env.MONITORING_API_KEY,
  endpoint: process.env.MONITORING_ENDPOINT || 'http://localhost:5000/api/hit',
  enableLogging: process.env.NODE_ENV !== 'production'
}));

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100, // Limit each IP to 100 requests per window
});
app.use('/api/', limiter);

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;

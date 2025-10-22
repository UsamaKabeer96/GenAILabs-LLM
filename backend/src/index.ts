import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { config } from './config/index';
import { AppRoutes } from './routes';
import { mongoDB } from './config/database';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for Vercel (fixes rate limiting issue)
if (process.env.VERCEL === "1") {
    app.set("trust proxy", 1);
}

// Connect to MongoDB
mongoDB();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));


// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing and compression
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(requestLogger);

// API routes
app.use('/api', AppRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

// For Vercel deployment, export the app instead of starting a server
export default app;

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = config.PORT || 3001;

    // Connect to MongoDB before starting server
    mongoDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 LLM Parameter Lab API ready`);
            console.log(`🔗 Health check: http://localhost:${PORT}/`);
        });
    }).catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}

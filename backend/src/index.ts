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

// Database connection middleware for Vercel
const ensureDatabaseConnection = async (req: any, res: any, next: any) => {
    if (process.env.VERCEL === "1") {
        try {
            if (mongoose.connection.readyState !== 1) {
                console.log('Attempting to connect to MongoDB...');
                await mongoDB();
                console.log('MongoDB connection established');
            }
        } catch (error) {
            console.error('MongoDB connection failed:', error);
            return res.status(500).json({
                error: 'Database connection failed',
                message: 'Unable to connect to the database'
            });
        }
    }
    next();
};

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

// Database connection middleware for Vercel
app.use(ensureDatabaseConnection);

// API routes
app.use('/api', AppRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    console.log('🏥 Health check requested');
    console.log('📊 Database state:', dbStates[dbState as keyof typeof dbStates]);
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('☁️ Vercel:', process.env.VERCEL);

    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        vercel: process.env.VERCEL === '1',
        database: {
            status: dbStates[dbState as keyof typeof dbStates],
            readyState: dbState,
            host: mongoose.connection.host || 'unknown',
            name: mongoose.connection.name || 'unknown'
        }
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

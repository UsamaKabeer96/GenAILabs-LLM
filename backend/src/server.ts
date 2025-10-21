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

// Load environment variables
dotenv.config();

const app = express();
const PORT = config.PORT;

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
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
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

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    const { DatabaseConnection } = require('./config/database');
    DatabaseConnection.getInstance().close();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    const { DatabaseConnection } = require('./config/database');
    DatabaseConnection.getInstance().close();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 LLM Parameter Lab API ready`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;

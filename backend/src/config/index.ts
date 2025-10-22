import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

export const config = {
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
    },
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3001,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    // Default to Gemini for free usage
    DEFAULT_LLM_PROVIDER: process.env.DEFAULT_LLM_PROVIDER || 'gemini',
}

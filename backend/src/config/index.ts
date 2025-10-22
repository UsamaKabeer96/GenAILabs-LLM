export const config = {
    openai: {
        apiKey: process.env.OPENAI_API_KEY || 'mock-key-for-development',
    },
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3001,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'mock-key-for-development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/llm-parameter-lab',
}

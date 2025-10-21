# LLM Parameter Lab

An experimental console for analyzing and comparing Large Language Model responses across different parameter configurations. This tool helps researchers and developers understand how parameters like temperature and top_p affect response quality and characteristics.

![LLM Parameter Lab](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue)
![Express](https://img.shields.io/badge/Express-4.18.2-green)

## Features

### **Experimental Analysis**

- **Multi-Parameter Testing**: Test different combinations of temperature, top_p, max_tokens, and penalty settings
- **Batch Processing**: Run multiple iterations per parameter set for statistical significance
- **Custom Quality Metrics**: Proprietary algorithms for measuring coherence, completeness, length appropriateness, and structural quality

### **Visual Dashboard**

- **Response Comparison**: Side-by-side analysis of generated responses
- **Statistical Insights**: Best/worst response identification and trend analysis
- **Real-time Metrics**: Live calculation of quality scores
- **Score Visualization**: Color-coded metrics with detailed breakdowns

### **Data Management**

- **Persistent Storage**: SQLite database for experiment history
- **Search & Filter**: Find experiments by prompt content or parameters
- **Export Options**: JSON and CSV formats
- **Experiment History**: Browse and manage past experiments

### **Modern UI/UX**

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Clean Interface**: Professional design with Tailwind CSS
- **Accessibility**: WCAG compliant design patterns
- **TypeScript**: Full type safety throughout the application

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- OpenAI API key (optional for development - uses mock responses if not provided)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd GenAILabs-LLM
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Configure environment (Optional)**

   ```bash
   # Create backend/.env file (optional for development)
   echo "OPENAI_API_KEY=your_api_key_here" > backend/.env
   ```

4. **Start development servers**

   ```bash
   # Terminal 1 - Start backend
   cd backend && npm run dev

   # Terminal 2 - Start frontend
   cd frontend && npm run dev
   ```

   This will start:

   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Architecture

### Frontend (Next.js 15)

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with custom design system
- **Language**: TypeScript for type safety
- **Components**: Modular React components with Layout system
- **Pages**: Home, New Experiment, Results, History, Documentation, API, Support

### Backend (Express + TypeScript)

- **API**: Express.js with TypeScript
- **Database**: SQLite with sqlite3
- **LLM Integration**: OpenAI API with fallback mock responses
- **Validation**: Zod schemas for type safety
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston for structured logging

### Modular Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection
│   │   └── index.ts             # Configuration
│   ├── modules/
│   │   ├── Experiment.model.ts  # Database operations
│   │   ├── experiment.controller.ts # Business logic
│   │   └── services/
│   │       ├── LLMService.ts    # LLM API calls
│   │       ├── QualityMetricsService.ts # Metrics calculation
│   │       ├── ExperimentService.ts # Experiment orchestration
│   │       └── DatabaseService.ts # Database interactions
│   ├── routes/
│   │   ├── experiments.ts       # Experiment endpoints
│   │   ├── exports.ts           # Export endpoints
│   │   └── index.ts             # Route consolidation
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   └── server.ts                # Main application file
```

### Quality Metrics Engine

The custom quality metrics system evaluates responses across four dimensions:

1. **Coherence Score** (0-1): Measures logical flow and transition quality
2. **Completeness Score** (0-1): Evaluates response structure and depth
3. **Length Score** (0-1): Assesses appropriateness of response length
4. **Structure Score** (0-1): Analyzes formatting and organization

Each metric uses multiple algorithms:

- Sentence analysis and transition word detection
- Readability scoring (simplified Flesch Reading Ease)
- Repetition analysis and vocabulary diversity
- Structural pattern recognition

## Usage Guide

### Creating an Experiment

1. **Navigate to "New Experiment"**
2. **Enter your prompt** (up to 10,000 characters)
3. **Select model** (GPT-3.5 Turbo, GPT-4, etc.)
4. **Configure parameters**:
   - Temperature: 0.0 - 2.0 (creativity)
   - Top P: 0.0 - 1.0 (diversity)
   - Max Tokens: 1 - 4000 (length limit)
   - Frequency/Presence Penalty: -2.0 - 2.0
5. **Set iterations** per parameter combination (1-10)
6. **Click "Run Experiment"**

### Analyzing Results

The results dashboard provides:

- **Summary Statistics**: Best/worst scores, averages
- **Response Analysis**: Detailed metrics for each response
- **Parameter Insights**: Which combinations performed best
- **Quality Breakdown**: Individual scores for coherence, completeness, length, and structure

### Managing Experiments

- **History Page**: View all past experiments
- **Search**: Find experiments by prompt content
- **Export**: Download experiment data in JSON or CSV format
- **Delete**: Remove experiments you no longer need

## API Reference

### Experiments

```typescript
POST /api/experiments
GET /api/experiments/:id
GET /api/experiments
DELETE /api/experiments/:id
```

### Export

```typescript
GET /api/export/experiment/:id/json
GET /api/export/experiment/:id/csv
```

### Health Check

```typescript
GET / health;
```

## Environment Variables

```bash
# Production
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
OPENAI_API_KEY=your_production_key
DATABASE_PATH=/app/data/experiments.db
```

## Testing

### Manual Testing

1. **Create Experiment**: Test experiment creation with different parameters
2. **View Results**: Verify metrics are calculated and displayed
3. **Export Data**: Test JSON and CSV export functionality
4. **Search History**: Test experiment search and filtering

### API Testing

```bash
# Test experiment creation
curl -X POST http://localhost:3001/api/experiments \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test prompt","model":"gpt-3.5-turbo","iterations":2,"parameters":[{"temperature":0.7,"top_p":0.9,"max_tokens":100}]}'

# Test experiment retrieval
curl http://localhost:3001/api/experiments/{experiment_id}

# Test experiment list
curl http://localhost:3001/api/experiments
```

**Built with ❤️ for the AI research community**

## Recent Updates

- ✅ Fixed database metrics persistence
- ✅ Resolved frontend "N/A" score display issue
- ✅ Improved error handling and edge cases
- ✅ Enhanced TypeScript configuration
- ✅ Updated modular backend architecture
- ✅ Added comprehensive API documentation

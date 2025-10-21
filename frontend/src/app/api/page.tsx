import { Layout } from '@/components/Layout'

export default function API() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
                    <p className="text-gray-600">
                        Programmatic access to the LLM Parameter Lab functionality
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Overview */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Overview</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                The LLM Parameter Lab API provides RESTful endpoints for creating experiments,
                                retrieving results, and managing your data programmatically.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-mono text-gray-600">
                                    Base URL: <span className="text-blue-600">http://localhost:3001/api</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Authentication */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                Currently, the API does not require authentication. All endpoints are publicly
                                accessible for development and testing purposes.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> In production, consider implementing API keys or
                                    authentication tokens for security.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Experiments Endpoints */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Experiments</h2>

                        {/* Create Experiment */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Create Experiment</h3>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                                <div>POST /api/experiments</div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Request Body:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="text-sm text-gray-700 overflow-x-auto">
                                            {`{
  "prompt": "Explain quantum computing",
  "model": "gpt-3.5-turbo",
  "iterations": 3,
  "parameters": [
    {
      "temperature": 0.7,
      "top_p": 0.9,
      "max_tokens": 500,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }
  ]
}`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Response:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="text-sm text-gray-700 overflow-x-auto">
                                            {`{
  "success": true,
  "data": {
    "id": "exp_123",
    "config": { ... },
    "responses": [ ... ],
    "metrics": [ ... ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Get All Experiments */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Get All Experiments</h3>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                                <div>GET /api/experiments</div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                                        <li><code>limit</code> - Number of experiments to return (default: 10)</li>
                                        <li><code>offset</code> - Number of experiments to skip (default: 0)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Response:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="text-sm text-gray-700 overflow-x-auto">
                                            {`{
  "success": true,
  "data": [
    {
      "id": "exp_123",
      "config": { ... },
      "responses": [ ... ],
      "metrics": [ ... ],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Get Single Experiment */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Get Single Experiment</h3>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                                <div>GET /api/experiments/&#123;id&#125;</div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Response:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="text-sm text-gray-700 overflow-x-auto">
                                            {`{
  "success": true,
  "data": {
    "id": "exp_123",
    "config": { ... },
    "responses": [ ... ],
    "metrics": [ ... ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delete Experiment */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Delete Experiment</h3>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                                <div>DELETE /api/experiments/&#123;id&#125;</div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Response:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="text-sm text-gray-700 overflow-x-auto">
                                            {`{
  "success": true,
  "message": "Experiment deleted successfully"
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export Endpoints */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export</h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Export Experiment</h3>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                                <div>GET /api/export/experiment/&#123;id&#125;/&#123;format&#125;</div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Parameters:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                                        <li><code>id</code> - Experiment ID</li>
                                        <li><code>format</code> - Export format (json or csv)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Response:</h4>
                                    <p className="text-sm text-gray-700">
                                        Returns a file download with the experiment data in the specified format.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Handling */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Handling</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                The API uses standard HTTP status codes and returns error information in JSON format:
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Error Response Format:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="text-sm text-gray-700 overflow-x-auto">
                                            {`{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Common Status Codes:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                                        <li><code>200</code> - Success</li>
                                        <li><code>400</code> - Bad Request (invalid parameters)</li>
                                        <li><code>404</code> - Not Found (experiment doesn't exist)</li>
                                        <li><code>500</code> - Internal Server Error</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rate Limiting */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate Limiting</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                To ensure fair usage and system stability, the API implements rate limiting:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                                <li>100 requests per minute per IP address</li>
                                <li>10 experiments per hour per IP address</li>
                                <li>Rate limit headers included in responses</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-center space-x-4">
                    <a href="/new" className="btn-primary">
                        Try the API
                    </a>
                    <a href="/docs" className="btn-secondary">
                        Read Documentation
                    </a>
                </div>
            </div>
        </Layout>
    )
}

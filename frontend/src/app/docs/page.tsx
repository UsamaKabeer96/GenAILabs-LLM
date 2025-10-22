import { Layout } from '@/components/Layout'

export default function Documentation() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Documentation</h1>
                    <p className="text-gray-600">
                        Learn how to use the LLM Parameter Lab effectively
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Getting Started */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                The LLM Parameter Lab is designed to help you understand how different parameters
                                affect Large Language Model responses using Gemini models. Follow these steps to get started:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>Navigate to the "New Experiment" page</li>
                                <li>Enter your prompt in the text area</li>
                                <li>Select your preferred model (OpenAI names are automatically mapped to Gemini)</li>
                                <li>Configure parameter sets with different values</li>
                                <li>Set the number of iterations per parameter set</li>
                                <li>Click "Run Experiment" to start the analysis</li>
                            </ol>
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> You can use familiar OpenAI model names (gpt-3.5-turbo, gpt-4, etc.)
                                    and they will be automatically mapped to their Gemini equivalents for processing.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Model Mapping */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Model Mapping</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                Our system automatically maps OpenAI model names to their Gemini equivalents,
                                allowing you to use familiar model names while leveraging Gemini's capabilities:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">OpenAI Models → Gemini</h3>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li><code>gpt-3.5-turbo</code> → <code>gemini-2.0-flash</code></li>
                                        <li><code>gpt-3.5-turbo-16k</code> → <code>gemini-2.0-flash</code></li>
                                        <li><code>gpt-4</code> → <code>gemini-2.0-flash</code></li>
                                        <li><code>gpt-4-turbo</code> → <code>gemini-2.0-flash</code></li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Direct Gemini Models</h3>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li><code>gemini-2.0-flash</code> - Fast, versatile model</li>
                                        <li><code>gemini-2.5-pro</code> - Advanced reasoning</li>
                                        <li><code>gemini-2.5-flash</code> - Balanced performance</li>
                                        <li><code>gemini-2.0-flash-lite</code> - Lightweight option</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <p className="text-sm text-green-800">
                                    <strong>Benefits:</strong> Use familiar OpenAI model names while getting Gemini's
                                    advanced capabilities, cost-effectiveness, and reliability.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Understanding Parameters */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Understanding Parameters</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Temperature (0.0 - 2.0)</h3>
                                <p>
                                    Controls randomness in the output. Lower values (0.1-0.3) make responses more
                                    focused and deterministic, while higher values (0.7-1.0) make them more creative
                                    and diverse.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Top P (0.0 - 1.0)</h3>
                                <p>
                                    Controls diversity via nucleus sampling. Lower values focus on more likely tokens,
                                    while higher values allow more diverse word choices.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Max Tokens (1 - 4000)</h3>
                                <p>
                                    Maximum number of tokens to generate in the response. Higher values allow for
                                    longer, more detailed responses.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Frequency Penalty (-2.0 - 2.0)</h3>
                                <p>
                                    Reduces likelihood of repeating the same line. Positive values discourage repetition.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Presence Penalty (-2.0 - 2.0)</h3>
                                <p>
                                    Reduces likelihood of talking about new topics. Positive values encourage
                                    staying on topic.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quality Metrics */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quality Metrics</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                Our system evaluates responses using custom metrics without requiring another LLM call:
                            </p>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Coherence Score</h3>
                                <p>
                                    Measures how logically connected and flowing the response is. Higher scores
                                    indicate better logical structure and flow.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Completeness Score</h3>
                                <p>
                                    Evaluates how thoroughly the response addresses the prompt. Higher scores
                                    indicate more comprehensive coverage of the topic.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Length Score</h3>
                                <p>
                                    Assesses whether the response length is appropriate for the prompt complexity.
                                    Optimal length varies by prompt type.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Structure Score</h3>
                                <p>
                                    Evaluates the organization and formatting of the response. Higher scores
                                    indicate better paragraph structure and formatting.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Overall Score</h3>
                                <p>
                                    Weighted combination of all metrics providing a single quality indicator
                                    for easy comparison.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Best Practices */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Experiment Design</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Test a range of parameter values to understand their effects</li>
                                    <li>Use multiple iterations to account for randomness</li>
                                    <li>Compare responses side-by-side for better insights</li>
                                    <li>Document your findings for future reference</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Prompt Writing</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Be specific and clear in your prompts</li>
                                    <li>Include context when necessary</li>
                                    <li>Test different prompt styles to see parameter effects</li>
                                    <li>Use consistent prompts across parameter sets for fair comparison</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Analysis</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Look for patterns in high-scoring responses</li>
                                    <li>Consider the trade-offs between creativity and accuracy</li>
                                    <li>Export data for deeper analysis in external tools</li>
                                    <li>Keep track of successful parameter combinations</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Troubleshooting */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Common Issues</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Experiment fails:</strong> Check your prompt length and parameter values</li>
                                    <li><strong>Model overloaded:</strong> Try using gemini-2.0-flash instead of gemini-2.5-pro</li>
                                    <li><strong>Low scores:</strong> Try adjusting temperature and top_p values</li>
                                    <li><strong>Inconsistent results:</strong> Increase iterations for more reliable averages</li>
                                    <li><strong>Export issues:</strong> Ensure you have permission to download files</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Getting Help</h3>
                                <p>
                                    If you encounter issues not covered in this documentation, please visit our
                                    support page or contact our team for assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-center space-x-4">
                    <a href="/new" className="btn-primary">
                        Start Your First Experiment
                    </a>
                    <a href="/support" className="btn-secondary">
                        Get Support
                    </a>
                </div>
            </div>
        </Layout>
    )
}

import { Layout } from '@/components/Layout'

export default function Home() {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Welcome to LLM Parameter Lab
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Experiment with different LLM parameters using Gemini models to understand how they affect response quality.
                        Analyze temperature, top_p, and other settings to optimize your AI interactions with automatic model mapping.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="card text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Gemini-Powered Experiments
                            </h3>
                            <p className="text-gray-600">
                                Create experiments using Gemini models with automatic OpenAI model name mapping for familiar interface.
                            </p>
                        </div>

                        <div className="card text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Smart Analysis
                            </h3>
                            <p className="text-gray-600">
                                Get comprehensive quality metrics and compare responses across different parameter combinations.
                            </p>
                        </div>

                        <div className="card text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Flexible Export
                            </h3>
                            <p className="text-gray-600">
                                Export results in JSON or CSV format for detailed analysis and integration with other tools.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <a href="/new" className="btn-primary">
                            Start New Experiment
                        </a>
                        <a href="/history" className="btn-secondary">
                            View History
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
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
                        Experiment with different LLM parameters to understand how they affect response quality.
                        Analyze temperature, top_p, and other settings to optimize your AI interactions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="card text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Create Experiments
                            </h3>
                            <p className="text-gray-600">
                                Set up experiments with different parameter combinations to test LLM responses.
                            </p>
                        </div>

                        <div className="card text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Analyze Results
                            </h3>
                            <p className="text-gray-600">
                                View detailed metrics and compare response quality across different parameter sets.
                            </p>
                        </div>

                        <div className="card text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Export Data
                            </h3>
                            <p className="text-gray-600">
                                Export your experiment results for further analysis and documentation.
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
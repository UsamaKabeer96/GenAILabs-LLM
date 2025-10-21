import { Layout } from '@/components/Layout'

export default function Support() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Support</h1>
                    <p className="text-gray-600">
                        Get help and support for the LLM Parameter Lab
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Contact Information */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <div className="space-y-4 text-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
                                    <p className="text-sm">
                                        For technical issues, feature requests, or general questions:
                                    </p>
                                    <p className="text-blue-600 font-mono text-sm">
                                        support@llmparameterlab.com
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Response Time</h3>
                                    <p className="text-sm">
                                        We typically respond to support requests within 24-48 hours
                                        during business days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-6 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">How do I create my first experiment?</h3>
                                <p className="text-sm">
                                    Navigate to the "New Experiment" page, enter your prompt, select a model,
                                    configure your parameter sets, and click "Run Experiment". The system will
                                    generate responses and calculate quality metrics automatically.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">What parameters should I test?</h3>
                                <p className="text-sm">
                                    Start with temperature (0.1-1.0) and top_p (0.1-1.0) as they have the
                                    most significant impact on response quality. Test multiple values to
                                    understand their effects on your specific use case.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">How are quality metrics calculated?</h3>
                                <p className="text-sm">
                                    Our custom metrics analyze response characteristics like coherence,
                                    completeness, length appropriateness, and structural quality without
                                    requiring additional LLM calls for evaluation.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Can I export my experiment data?</h3>
                                <p className="text-sm">
                                    Yes! You can export experiment results in both JSON and CSV formats
                                    from the History page or Results page for further analysis.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Why are my experiment scores low?</h3>
                                <p className="text-sm">
                                    Low scores might indicate issues with prompt clarity, inappropriate
                                    parameter values, or model limitations. Try adjusting temperature and
                                    top_p values, or refine your prompt for better results.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Is there a limit on experiments?</h3>
                                <p className="text-sm">
                                    Currently, there are no strict limits, but we implement rate limiting
                                    to ensure fair usage. You can run multiple experiments and manage
                                    them through the History page.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Troubleshooting */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Common Issues</h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-1">Experiment fails to run</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                                            <li>Check that your prompt is not empty</li>
                                            <li>Ensure parameter values are within valid ranges</li>
                                            <li>Verify your internet connection</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-1">Low quality scores</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                                            <li>Try different temperature values (0.3-0.7)</li>
                                            <li>Adjust top_p values (0.8-0.95)</li>
                                            <li>Improve prompt clarity and specificity</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-1">Export not working</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                                            <li>Check browser popup blockers</li>
                                            <li>Ensure you have download permissions</li>
                                            <li>Try a different browser if issues persist</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Requests */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Requests</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                We're constantly improving the LLM Parameter Lab based on user feedback.
                                If you have ideas for new features or improvements, we'd love to hear from you!
                            </p>

                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-800 mb-2">Upcoming Features</h3>
                                <ul className="list-disc list-inside text-sm text-blue-700 ml-4">
                                    <li>Advanced parameter optimization algorithms</li>
                                    <li>Custom metric definitions</li>
                                    <li>Batch experiment processing</li>
                                    <li>Integration with more LLM providers</li>
                                    <li>Collaborative experiment sharing</li>
                                </ul>
                            </div>

                            <p className="text-sm">
                                Send your feature requests to our support email with detailed descriptions
                                of what you'd like to see implemented.
                            </p>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Community</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                Join our community to share experiments, learn from others, and get help
                                from fellow users.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">GitHub</h3>
                                    <p className="text-sm mb-2">
                                        Report bugs, contribute code, and track development:
                                    </p>
                                    <p className="text-blue-600 font-mono text-sm">
                                        github.com/llmparameterlab
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Discord</h3>
                                    <p className="text-sm mb-2">
                                        Join our Discord server for real-time discussions:
                                    </p>
                                    <p className="text-blue-600 font-mono text-sm">
                                        discord.gg/llmparameterlab
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-sm">All systems operational</span>
                            </div>

                            <p className="text-sm">
                                Check our status page for real-time updates on system performance
                                and any ongoing maintenance.
                            </p>

                            <a href="#" className="text-blue-600 text-sm hover:underline">
                                View detailed status page →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-center space-x-4">
                    <a href="/new" className="btn-primary">
                        Start Experimenting
                    </a>
                    <a href="/docs" className="btn-secondary">
                        Read Documentation
                    </a>
                </div>
            </div>
        </Layout>
    )
}

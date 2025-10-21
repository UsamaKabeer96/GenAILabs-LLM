'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { ExperimentResult } from '@/types'
import { api } from '@/lib/api'

export default function Results() {
    const [experiment, setExperiment] = useState < ExperimentResult | null > (null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState < string | null > (null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const experimentId = urlParams.get('id')

        if (experimentId) {
            fetchExperiment(experimentId)
        } else {
            setError('No experiment ID provided')
            setLoading(false)
        }
    }, [])

    const fetchExperiment = async (id: string) => {
        try {
            const data = await api.experiments.getById(id)
            setExperiment(data.data)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 0.8) return 'text-green-600'
        if (score >= 0.6) return 'text-blue-600'
        if (score >= 0.4) return 'text-yellow-600'
        return 'text-red-600'
    }

    if (loading) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <div className="text-lg text-gray-600">Loading experiment results...</div>
                    </div>
                </div>
            </Layout>
        )
    }

    if (error || !experiment) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <div className="text-lg text-red-600 mb-4">
                            {error || 'Experiment not found'}
                        </div>
                        <a href="/history" className="btn-primary">
                            View Experiment History
                        </a>
                    </div>
                </div>
            </Layout>
        )
    }

    const avgScore = experiment.metrics.length > 0
        ? experiment.metrics.reduce((sum, m) => sum + m.overall_score, 0) / experiment.metrics.length
        : 0
    const bestScore = experiment.metrics.length > 0
        ? Math.max(...experiment.metrics.map(m => m.overall_score))
        : 0
    const worstScore = experiment.metrics.length > 0
        ? Math.min(...experiment.metrics.map(m => m.overall_score))
        : 0

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Experiment Results</h1>
                    <p className="text-gray-600">
                        ID: {experiment.id} • Created: {new Date(experiment.created_at).toLocaleString()}
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card text-center">
                        <div className={`text-2xl font-bold mb-1 ${experiment.metrics.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                            {experiment.metrics.length > 0 ? Math.round(avgScore * 100) / 100 : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Average Score</div>
                    </div>

                    <div className="card text-center">
                        <div className={`text-2xl font-bold mb-1 ${experiment.metrics.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            {experiment.metrics.length > 0 ? Math.round(bestScore * 100) / 100 : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Best Score</div>
                    </div>

                    <div className="card text-center">
                        <div className={`text-2xl font-bold mb-1 ${experiment.metrics.length > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {experiment.metrics.length > 0 ? Math.round(worstScore * 100) / 100 : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Worst Score</div>
                    </div>

                    <div className="card text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {experiment.responses.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Responses</div>
                    </div>
                </div>

                {/* No Metrics Warning */}
                {experiment.metrics.length === 0 && (
                    <div className="card bg-yellow-50 border-yellow-200 mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="text-yellow-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-800">No Quality Metrics Available</h3>
                                <p className="text-yellow-700">
                                    This experiment was created before quality metrics were implemented.
                                    The responses are available below, but quality scores cannot be calculated.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Responses */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Response Analysis</h2>

                    {experiment.responses.map((response, index) => {
                        const metric = experiment.metrics[index]

                        return (
                            <div key={response.id} className="card">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Response {index + 1}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>T: {response.parameters.temperature}</span>
                                            <span>P: {response.parameters.top_p}</span>
                                            <span>Tokens: {response.parameters.max_tokens}</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        {metric ? (
                                            <>
                                                <div className={`text-xl font-bold ${getScoreColor(metric.overall_score)}`}>
                                                    {Math.round(metric.overall_score * 100) / 100}
                                                </div>
                                                <div className="text-sm text-gray-600">Overall Score</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-xl font-bold text-gray-400">N/A</div>
                                                <div className="text-sm text-gray-600">No Metrics</div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {metric ? (
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div className="text-center">
                                            <div className={`text-lg font-semibold ${getScoreColor(metric.coherence_score)}`}>
                                                {Math.round(metric.coherence_score * 100) / 100}
                                            </div>
                                            <div className="text-xs text-gray-600">Coherence</div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`text-lg font-semibold ${getScoreColor(metric.completeness_score)}`}>
                                                {Math.round(metric.completeness_score * 100) / 100}
                                            </div>
                                            <div className="text-xs text-gray-600">Completeness</div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`text-lg font-semibold ${getScoreColor(metric.length_score)}`}>
                                                {Math.round(metric.length_score * 100) / 100}
                                            </div>
                                            <div className="text-xs text-gray-600">Length</div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`text-lg font-semibold ${getScoreColor(metric.structure_score)}`}>
                                                {Math.round(metric.structure_score * 100) / 100}
                                            </div>
                                            <div className="text-xs text-gray-600">Structure</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 text-center">
                                            Quality metrics not available for this response
                                        </p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Response Text:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800">
                                        {response.text}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-4">
                                        {metric ? (
                                            <>
                                                <span>{metric.details.word_count} words</span>
                                                <span>{metric.details.sentence_count} sentences</span>
                                                <span>Readability: {Math.round(metric.details.readability_score)}</span>
                                            </>
                                        ) : (
                                            <span>Basic metrics not available</span>
                                        )}
                                    </div>
                                    <span>{response.metadata.response_time}ms</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-center space-x-4">
                    <a href="/new" className="btn-primary">
                        Run New Experiment
                    </a>
                    <a href="/history" className="btn-secondary">
                        View History
                    </a>
                </div>
            </div>
        </Layout>
    )
}

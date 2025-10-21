'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { api } from '@/lib/api'
import { ExperimentResult } from '@/types'

export default function History() {
    const [experiments, setExperiments] = useState < ExperimentResult[] > ([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState < string | null > (null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchExperiments()
    }, [])

    const fetchExperiments = async () => {
        try {
            const data = await api.experiments.getAll()
            setExperiments(data.data || [])
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const deleteExperiment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experiment?')) return

        try {
            await api.experiments.delete(id)
            setExperiments(prev => prev.filter(exp => exp.id !== id))
            alert('Experiment deleted successfully')
        } catch (error) {
            alert('Error deleting experiment: ' + (error instanceof Error ? error.message : 'An error occurred'))
        }
    }

    const exportExperiment = async (id: string, format: 'json' | 'csv') => {
        try {
            const data = await api.export.experiment(id, format)

            // Create download link
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `experiment-${id}.${format}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            alert('Error exporting experiment: ' + (error instanceof Error ? error.message : 'An error occurred'))
        }
    }

    const filteredExperiments = experiments.filter(experiment =>
        experiment.config.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                        <div className="text-lg text-gray-600">Loading experiments...</div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Experiment History</h1>
                    <p className="text-gray-600 mb-6">
                        Browse and manage your past experiments
                    </p>

                    {/* Search */}
                    <div className="max-w-md">
                        <input
                            type="text"
                            placeholder="Search experiments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {experiments.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Experiments</div>
                    </div>

                    <div className="card text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {experiments.reduce((sum, exp) => sum + exp.responses.length, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Responses</div>
                    </div>

                    <div className="card text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {experiments.length > 0
                                ? Math.round(experiments.reduce((sum, exp) => {
                                    if (exp.metrics.length === 0) return sum
                                    return sum + exp.metrics.reduce((mSum, m) => mSum + m.overall_score, 0) / exp.metrics.length
                                }, 0) / experiments.filter(exp => exp.metrics.length > 0).length * 100) / 100
                                : 0
                            }
                        </div>
                        <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                </div>

                {/* Experiments List */}
                {error ? (
                    <div className="text-center">
                        <div className="text-lg text-red-600 mb-4">{error}</div>
                        <button onClick={fetchExperiments} className="btn-primary">
                            Try Again
                        </button>
                    </div>
                ) : filteredExperiments.length === 0 ? (
                    <div className="text-center">
                        <div className="text-lg text-gray-600 mb-4">
                            {searchQuery ? 'No experiments found matching your search' : 'No experiments yet'}
                        </div>
                        <a href="/new" className="btn-primary">
                            Create Your First Experiment
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredExperiments.map((experiment) => {
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
                                <div key={experiment.id} className="card">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {experiment.config.prompt.substring(0, 80)}
                                                    {experiment.config.prompt.length > 80 && '...'}
                                                </h3>
                                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {experiment.config.model}
                                                </span>
                                                {experiment.metrics.length === 0 && (
                                                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                        No Metrics
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                                <span>Created: {new Date(experiment.created_at).toLocaleDateString()}</span>
                                                <span>{experiment.responses.length} responses</span>
                                                <span>{experiment.config.parameters.length} parameter sets</span>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                <div className="text-center">
                                                    <div className={`text-lg font-bold ${experiment.metrics.length > 0 ? getScoreColor(avgScore) : 'text-gray-400'}`}>
                                                        {experiment.metrics.length > 0 ? Math.round(avgScore * 100) / 100 : 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Avg Score</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-lg font-bold ${experiment.metrics.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {experiment.metrics.length > 0 ? Math.round(bestScore * 100) / 100 : 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Best</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-lg font-bold ${experiment.metrics.length > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                        {experiment.metrics.length > 0 ? Math.round(worstScore * 100) / 100 : 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Worst</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-6">
                                            <a
                                                href={`/results?id=${experiment.id}`}
                                                className="btn-primary text-sm"
                                            >
                                                View Results
                                            </a>

                                            <button
                                                onClick={() => exportExperiment(experiment.id, 'json')}
                                                className="btn-secondary text-sm"
                                                title="Export JSON"
                                            >
                                                JSON
                                            </button>

                                            <button
                                                onClick={() => exportExperiment(experiment.id, 'csv')}
                                                className="btn-secondary text-sm"
                                                title="Export CSV"
                                            >
                                                CSV
                                            </button>

                                            <button
                                                onClick={() => deleteExperiment(experiment.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                                title="Delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex justify-center">
                    <a href="/new" className="btn-primary">
                        Create New Experiment
                    </a>
                </div>
            </div>
        </Layout>
    )
}

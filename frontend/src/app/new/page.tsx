'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { ExperimentConfig, ParameterSet } from '@/types'
import { api } from '@/lib/api'

export default function NewExperiment() {
    const [formData, setFormData] = useState < ExperimentConfig > ({
        prompt: '',
        model: 'gpt-3.5-turbo',
        iterations: 3,
        parameters: [
            { temperature: 0.7, top_p: 0.9, max_tokens: 500, frequency_penalty: 0, presence_penalty: 0 }
        ]
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const addParameterSet = () => {
        setFormData(prev => ({
            ...prev,
            parameters: [
                ...prev.parameters,
                { temperature: 0.7, top_p: 0.9, max_tokens: 500, frequency_penalty: 0, presence_penalty: 0 }
            ]
        }))
    }

    const removeParameterSet = (index: number) => {
        if (formData.parameters.length > 1) {
            setFormData(prev => ({
                ...prev,
                parameters: prev.parameters.filter((_, i) => i !== index)
            }))
        }
    }

    const updateParameterSet = (index: number, field: keyof ParameterSet, value: number) => {
        setFormData(prev => ({
            ...prev,
            parameters: prev.parameters.map((param, i) =>
                i === index ? { ...param, [field]: value } : param
            )
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await api.experiments.create(formData)
            alert('Experiment created successfully!')
            // Redirect to results page
            window.location.href = `/results?id=${result.data.id}`
        } catch (error) {
            alert('Error creating experiment: ' + (error instanceof Error ? error.message : 'An error occurred'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">New Experiment</h1>
                    <p className="text-gray-600">
                        Configure parameters and run experiments to analyze LLM response quality
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Prompt */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prompt
                        </label>
                        <textarea
                            value={formData.prompt}
                            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                            rows={4}
                            className="input-field"
                            placeholder="Enter your prompt here..."
                            required
                        />
                    </div>

                    {/* Model and Iterations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Model
                            </label>
                            <select
                                value={formData.model}
                                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                                className="input-field"
                            >
                                <optgroup label="OpenAI Models (mapped to Gemini)">
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16K</option>
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                </optgroup>
                                <optgroup label="Gemini Models">
                                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                    <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
                                </optgroup>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Iterations per Parameter Set
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={formData.iterations}
                                onChange={(e) => setFormData(prev => ({ ...prev, iterations: parseInt(e.target.value) }))}
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    {/* Parameter Sets */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Parameter Sets ({formData.parameters.length})
                            </h3>
                            <button
                                type="button"
                                onClick={addParameterSet}
                                className="btn-secondary"
                            >
                                Add Parameter Set
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.parameters.map((param, index) => (
                                <div key={index} className="card">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">
                                            Parameter Set {index + 1}
                                        </h4>
                                        {formData.parameters.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeParameterSet(index)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Temperature
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="2"
                                                value={param.temperature}
                                                onChange={(e) => updateParameterSet(index, 'temperature', parseFloat(e.target.value))}
                                                className="input-field text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Top P
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="1"
                                                value={param.top_p}
                                                onChange={(e) => updateParameterSet(index, 'top_p', parseFloat(e.target.value))}
                                                className="input-field text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Max Tokens
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="4000"
                                                value={param.max_tokens}
                                                onChange={(e) => updateParameterSet(index, 'max_tokens', parseInt(e.target.value))}
                                                className="input-field text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Frequency Penalty
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="-2"
                                                max="2"
                                                value={param.frequency_penalty || 0}
                                                onChange={(e) => updateParameterSet(index, 'frequency_penalty', parseFloat(e.target.value))}
                                                className="input-field text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Presence Penalty
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="-2"
                                                max="2"
                                                value={param.presence_penalty || 0}
                                                onChange={(e) => updateParameterSet(index, 'presence_penalty', parseFloat(e.target.value))}
                                                className="input-field text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary"
                        >
                            {isSubmitting ? 'Running Experiment...' : 'Run Experiment'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

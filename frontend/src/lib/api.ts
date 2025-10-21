import { ExperimentResult, ExperimentConfig } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

export const api = {
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        })

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`)
        }

        return response.json()
    },

    // Experiment endpoints
    experiments: {
        create: (data: ExperimentConfig) => api.request<ExperimentResult>('/api/experiments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

        getAll: () => api.request<ExperimentResult[]>('/api/experiments'),

        getById: (id: string) => api.request<ExperimentResult>(`/api/experiments/${id}`),

        delete: (id: string) => api.request<{ success: boolean }>(`/api/experiments/${id}`, {
            method: 'DELETE',
        }),
    },

    // Export endpoints
    export: {
        experiment: (id: string, format: 'json' | 'csv') =>
            api.request<Record<string, unknown>>(`/api/export/experiment/${id}/${format}`),
    },
}
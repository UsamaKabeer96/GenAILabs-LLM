import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ExperimentResult, ExperimentConfig } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

// Create axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
        return config
    },
    (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
    }
)

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error) => {
        console.error('Response error:', error.response?.data || error.message)
        if (error.response?.status === 404) {
            throw new Error('Resource not found')
        } else if (error.response?.status >= 500) {
            throw new Error('Server error occurred')
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout')
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Network error')
        }
    }
)

export const api = {
    // Generic request method using axios
    async request<T>(endpoint: string, options: any = {}): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.request<ApiResponse<T>>({
                url: endpoint,
                ...options,
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    // Experiment endpoints
    experiments: {
        create: (data: ExperimentConfig) => 
            api.request<ExperimentResult>('/api/experiments', {
                method: 'POST',
                data,
            }),

        getAll: () => 
            api.request<ExperimentResult[]>('/api/experiments'),

        getById: (id: string) => 
            api.request<ExperimentResult>(`/api/experiments/${id}`),

        delete: (id: string) => 
            api.request<{ success: boolean }>(`/api/experiments/${id}`, {
                method: 'DELETE',
            }),
    },

    // Export endpoints
    export: {
        experiment: (id: string, format: 'json' | 'csv') =>
            api.request<Record<string, unknown>>(`/api/export/experiment/${id}/${format}`),
    },
}
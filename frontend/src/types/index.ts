export interface ExperimentConfig {
    prompt: string
    model: string
    iterations: number
    parameters: ParameterSet[]
}

export interface ParameterSet {
    temperature: number
    top_p: number
    max_tokens: number
    frequency_penalty?: number
    presence_penalty?: number
}

export interface LLMResponse {
    id: string
    text: string
    parameters: ParameterSet
    metadata: {
        response_time: number
        tokens_used: number
    }
}

export interface QualityMetrics {
    response_id: string
    coherence_score: number
    completeness_score: number
    length_score: number
    structure_score: number
    overall_score: number
    details: {
        word_count: number
        sentence_count: number
        readability_score: number
    }
}

export interface ExperimentResult {
    id: string
    config: ExperimentConfig
    responses: LLMResponse[]
    metrics: QualityMetrics[]
    created_at: string
}

export interface ComparisonData {
    parameter_combinations: ParameterSet[]
    average_scores: {
        coherence: number[]
        completeness: number[]
        length: number[]
        structure: number[]
        overall: number[]
    }
    best_response: {
        parameters: ParameterSet
        score: number
        response_id: string
    }
    worst_response: {
        parameters: ParameterSet
        score: number
        response_id: string
    }
}
export interface LLMParameters {
    temperature: number;
    top_p: number;
    max_tokens: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}

export interface ExperimentConfig {
    prompt: string;
    parameters: LLMParameters[];
    model: string;
    iterations: number;
}

export interface LLMResponse {
    id: string;
    text: string;
    parameters: LLMParameters;
    metadata: {
        tokens_used: number;
        finish_reason: string;
        response_time: number;
    };
}

export interface QualityMetrics {
    coherence_score: number;
    completeness_score: number;
    length_score: number;
    structure_score: number;
    overall_score: number;
    response_id: string;
    details: {
        sentence_count: number;
        word_count: number;
        avg_sentence_length: number;
        readability_score: number;
        repetition_score: number;
        question_count: number;
        exclamation_count: number;
    };
}

export interface ExperimentResult {
    id: string;
    config: ExperimentConfig;
    responses: LLMResponse[];
    metrics: QualityMetrics[];
    created_at: string;
    updated_at: string;
}

export interface ComparisonData {
    parameter_combinations: LLMParameters[];
    average_scores: {
        coherence: number[];
        completeness: number[];
        length: number[];
        structure: number[];
        overall: number[];
    };
    best_response: {
        parameters: LLMParameters;
        score: number;
        response_id: string;
    };
    worst_response: {
        parameters: LLMParameters;
        score: number;
        response_id: string;
    };
}

export interface ExportFormat {
    experiment_id: string;
    timestamp: string;
    config: ExperimentConfig;
    results: {
        responses: LLMResponse[];
        metrics: QualityMetrics[];
        comparison: ComparisonData;
    };
}

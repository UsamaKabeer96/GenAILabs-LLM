import { ExperimentConfig, ExperimentResult, LLMResponse, QualityMetrics, ComparisonData } from '../../types';
import { LLMService } from './LLMService';
import { QualityMetricsService } from './QualityMetricsService';
import { DatabaseService } from './DatabaseService';

export class ExperimentService {
    private llmService: LLMService;
    private qualityService: QualityMetricsService;
    private dbService: DatabaseService;

    constructor() {
        this.llmService = new LLMService();
        this.qualityService = new QualityMetricsService();
        this.dbService = new DatabaseService();
    }

    /**
     * Run a complete experiment with the given configuration
     */
    async runExperiment(config: ExperimentConfig): Promise<ExperimentResult> {
        const experimentId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        try {
            // Validate configuration
            this.validateConfig(config);

            // Generate responses
            console.log(`Starting experiment ${experimentId} with ${config.parameters.length} parameter sets`);
            const responses = await this.llmService.generateExperimentResponses(config);

            // Calculate quality metrics for each response
            console.log(`Calculating quality metrics for ${responses.length} responses`);
            const metrics: QualityMetrics[] = responses.map(response => {
                const metric = this.qualityService.calculateMetrics(response);
                return {
                    ...metric,
                    response_id: response.id,
                };
            });

            // Create experiment result
            const experiment: ExperimentResult = {
                id: experimentId,
                config,
                responses,
                metrics,
                created_at: now,
                updated_at: now,
            };

            // Save to database
            await this.dbService.saveExperiment(experiment);

            console.log(`Experiment ${experimentId} completed successfully`);
            return experiment;

        } catch (error) {
            console.error(`Error running experiment ${experimentId}:`, error);
            throw new Error(`Failed to run experiment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get experiment by ID
     */
    async getExperiment(id: string): Promise<ExperimentResult | null> {
        return await this.dbService.getExperiment(id);
    }

    /**
     * Get all experiments with pagination
     */
    async getExperiments(limit: number = 20, offset: number = 0): Promise<ExperimentResult[]> {
        return await this.dbService.getExperiments(limit, offset);
    }

    /**
     * Delete experiment
     */
    async deleteExperiment(id: string): Promise<boolean> {
        return await this.dbService.deleteExperiment(id);
    }

    /**
     * Search experiments
     */
    async searchExperiments(query: string, limit: number = 20): Promise<ExperimentResult[]> {
        return await this.dbService.searchExperiments(query, limit);
    }

    /**
     * Get experiment statistics
     */
    async getExperimentStats() {
        return await this.dbService.getExperimentStats();
    }

    /**
     * Generate comparison data for an experiment
     */
    generateComparisonData(experiment: ExperimentResult): ComparisonData {
        const parameterCombinations = experiment.config.parameters;
        const metrics = experiment.metrics;
        const responses = experiment.responses;

        // Group metrics by parameter combination
        const metricsByParams: { [key: string]: QualityMetrics[] } = {};

        responses.forEach((response, index) => {
            const paramKey = JSON.stringify(response.parameters);
            if (!metricsByParams[paramKey]) {
                metricsByParams[paramKey] = [];
            }
            metricsByParams[paramKey].push(metrics[index]);
        });

        // Calculate average scores for each parameter combination
        const averageScores = {
            coherence: [] as number[],
            completeness: [] as number[],
            length: [] as number[],
            structure: [] as number[],
            overall: [] as number[],
        };

        parameterCombinations.forEach(params => {
            const paramKey = JSON.stringify(params);
            const paramMetrics = metricsByParams[paramKey] || [];

            if (paramMetrics.length > 0) {
                const avgCoherence = paramMetrics.reduce((sum, m) => sum + m.coherence_score, 0) / paramMetrics.length;
                const avgCompleteness = paramMetrics.reduce((sum, m) => sum + m.completeness_score, 0) / paramMetrics.length;
                const avgLength = paramMetrics.reduce((sum, m) => sum + m.length_score, 0) / paramMetrics.length;
                const avgStructure = paramMetrics.reduce((sum, m) => sum + m.structure_score, 0) / paramMetrics.length;
                const avgOverall = paramMetrics.reduce((sum, m) => sum + m.overall_score, 0) / paramMetrics.length;

                averageScores.coherence.push(Math.round(avgCoherence * 100) / 100);
                averageScores.completeness.push(Math.round(avgCompleteness * 100) / 100);
                averageScores.length.push(Math.round(avgLength * 100) / 100);
                averageScores.structure.push(Math.round(avgStructure * 100) / 100);
                averageScores.overall.push(Math.round(avgOverall * 100) / 100);
            } else {
                averageScores.coherence.push(0);
                averageScores.completeness.push(0);
                averageScores.length.push(0);
                averageScores.structure.push(0);
                averageScores.overall.push(0);
            }
        });

        // Find best and worst responses
        let bestScore = -1;
        let worstScore = 1;
        let bestResponse = null;
        let worstResponse = null;

        metrics.forEach((metric, index) => {
            if (metric.overall_score > bestScore) {
                bestScore = metric.overall_score;
                bestResponse = {
                    parameters: responses[index].parameters,
                    score: metric.overall_score,
                    response_id: responses[index].id,
                };
            }

            if (metric.overall_score < worstScore) {
                worstScore = metric.overall_score;
                worstResponse = {
                    parameters: responses[index].parameters,
                    score: metric.overall_score,
                    response_id: responses[index].id,
                };
            }
        });

        return {
            parameter_combinations: parameterCombinations,
            average_scores: averageScores,
            best_response: bestResponse!,
            worst_response: worstResponse!,
        };
    }

    /**
     * Generate parameter combinations for testing
     */
    static generateParameterCombinations(
        temperatureRange: [number, number] = [0.1, 1.5],
        topPRange: [number, number] = [0.1, 1.0],
        maxTokens: number = 500,
        steps: number = 3
    ): any[] {
        const combinations: any[] = [];
        const tempStep = (temperatureRange[1] - temperatureRange[0]) / (steps - 1);
        const topPStep = (topPRange[1] - topPRange[0]) / (steps - 1);

        for (let i = 0; i < steps; i++) {
            for (let j = 0; j < steps; j++) {
                const temperature = Math.round((temperatureRange[0] + i * tempStep) * 100) / 100;
                const topP = Math.round((topPRange[0] + j * topPStep) * 100) / 100;

                combinations.push({
                    temperature,
                    top_p: topP,
                    max_tokens: maxTokens,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });
            }
        }

        return combinations;
    }

    /**
     * Validate experiment configuration
     */
    private validateConfig(config: ExperimentConfig): void {
        if (!config.prompt || config.prompt.trim().length === 0) {
            throw new Error('Prompt is required');
        }

        if (!config.parameters || config.parameters.length === 0) {
            throw new Error('At least one parameter combination is required');
        }

        if (config.iterations < 1 || config.iterations > 10) {
            throw new Error('Iterations must be between 1 and 10');
        }

        if (!config.model || config.model.trim().length === 0) {
            throw new Error('Model is required');
        }

        // Validate each parameter set
        config.parameters.forEach((params, index) => {
            const validation = LLMService.validateParameters(params);
            if (!validation.valid) {
                throw new Error(`Invalid parameters at index ${index}: ${validation.errors.join(', ')}`);
            }
        });
    }

    /**
     * Close database connection
     */
    close(): void {
        this.dbService.close();
    }
}

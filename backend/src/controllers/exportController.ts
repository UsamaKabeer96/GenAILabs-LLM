import { Router, Request, Response } from 'express';
import { ExperimentResult, ExportFormat, LLMParameters, LLMResponse, QualityMetrics } from '@/types';
import { ExperimentService } from '@/modules/services/ExperimentService';

export const exportController = (experimentService: ExperimentService) => {
    const router = Router();

    // Export experiment as JSON
    router.get('/experiment/:id/json', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const experiment = await experimentService.getExperiment(id);

            if (!experiment) {
                res.status(404).json({
                    success: false,
                    error: 'Experiment not found'
                });
                return;
            }

            const comparison = experimentService.generateComparisonData(experiment);

            const exportData: ExportFormat = {
                experiment_id: experiment.id,
                timestamp: new Date().toISOString(),
                config: experiment.config,
                results: {
                    responses: experiment.responses,
                    metrics: experiment.metrics,
                    comparison,
                },
            };

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="experiment_${id}.json"`);
            res.json(exportData);
        } catch (error) {
            console.error('Error exporting experiment as JSON:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Export experiment as CSV
    router.get('/experiment/:id/csv', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const experiment = await experimentService.getExperiment(id);

            if (!experiment) {
                res.status(404).json({
                    success: false,
                    error: 'Experiment not found'
                });
                return;
            }

            // Generate CSV content
            const csvHeaders = [
                'Response ID',
                'Temperature',
                'Top P',
                'Max Tokens',
                'Frequency Penalty',
                'Presence Penalty',
                'Response Text',
                'Coherence Score',
                'Completeness Score',
                'Length Score',
                'Structure Score',
                'Overall Score',
                'Word Count',
                'Sentence Count',
                'Avg Sentence Length',
                'Readability Score',
                'Repetition Score',
                'Question Count',
                'Exclamation Count',
                'Tokens Used',
                'Response Time (ms)',
                'Finish Reason'
            ];

            const csvRows = experiment.responses.map((response: LLMResponse, index: number) => {
                const metric = experiment.metrics[index] as QualityMetrics;
                return [
                    response.id,
                    response.parameters.temperature,
                    response.parameters.top_p,
                    response.parameters.max_tokens,
                    response.parameters.frequency_penalty || 0,
                    response.parameters.presence_penalty || 0,
                    `"${response.text.replace(/"/g, '""')}"`, // Escape quotes in text
                    metric.coherence_score,
                    metric.completeness_score,
                    metric.length_score,
                    metric.structure_score,
                    metric.overall_score,
                    metric.details.word_count,
                    metric.details.sentence_count,
                    metric.details.avg_sentence_length,
                    metric.details.readability_score,
                    metric.details.repetition_score,
                    metric.details.question_count,
                    metric.details.exclamation_count,
                    response.metadata.tokens_used,
                    response.metadata.response_time,
                    response.metadata.finish_reason
                ];
            });

            const csvContent = [csvHeaders, ...csvRows]
                .map(row => row.join(','))
                .join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="experiment_${id}.csv"`);
            res.send(csvContent);
        } catch (error) {
            console.error('Error exporting experiment as CSV:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Export experiment summary as PDF (text-based for now)
    router.get('/experiment/:id/summary', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const experiment = await experimentService.getExperiment(id);

            if (!experiment) {
                res.status(404).json({
                    success: false,
                    error: 'Experiment not found'
                });
                return;
            }

            const comparison = experimentService.generateComparisonData(experiment);

            // Generate summary report
            const summary = {
                experiment_id: experiment.id,
                created_at: experiment.created_at,
                prompt: experiment.config.prompt,
                model: experiment.config.model,
                total_responses: experiment.responses.length,
                parameter_combinations: experiment.config.parameters.length,
                iterations_per_combination: experiment.config.iterations,

                // Best and worst responses
                best_response: {
                    parameters: comparison.best_response.parameters,
                    score: comparison.best_response.score,
                    text_preview: experiment.responses.find((r: LLMResponse) => r.id === comparison.best_response.response_id)?.text.substring(0, 200) + '...'
                },

                worst_response: {
                    parameters: comparison.worst_response.parameters,
                    score: comparison.worst_response.score,
                    text_preview: experiment.responses.find((r: LLMResponse) => r.id === comparison.worst_response.response_id)?.text.substring(0, 200) + '...'
                },

                // Average scores by parameter combination
                parameter_analysis: experiment.config.parameters.map((params: LLMParameters, index: number) => ({
                    parameters: params,
                    avg_coherence: comparison.average_scores.coherence[index],
                    avg_completeness: comparison.average_scores.completeness[index],
                    avg_length: comparison.average_scores.length[index],
                    avg_structure: comparison.average_scores.structure[index],
                    avg_overall: comparison.average_scores.overall[index]
                })),

                // Overall statistics
                overall_stats: {
                    avg_coherence: experiment.metrics.reduce((sum: number, m: QualityMetrics) => sum + m.coherence_score, 0) / experiment.metrics.length,
                    avg_completeness: experiment.metrics.reduce((sum: number, m: QualityMetrics) => sum + m.completeness_score, 0) / experiment.metrics.length,
                    avg_length: experiment.metrics.reduce((sum: number, m: QualityMetrics) => sum + m.length_score, 0) / experiment.metrics.length,
                    avg_structure: experiment.metrics.reduce((sum: number, m: QualityMetrics) => sum + m.structure_score, 0) / experiment.metrics.length,
                    avg_overall: experiment.metrics.reduce((sum: number, m: QualityMetrics) => sum + m.overall_score, 0) / experiment.metrics.length,
                    total_tokens: experiment.responses.reduce((sum: number, r: LLMResponse) => sum + r.metadata.tokens_used, 0),
                    avg_response_time: experiment.responses.reduce((sum: number, r: LLMResponse) => sum + r.metadata.response_time, 0) / experiment.responses.length
                }
            };

            res.json({
                success: true,
                data: summary
            });
        } catch (error) {
            console.error('Error generating summary:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Export all experiments as JSON
    router.get('/all/json', async (req: Request, res: Response) => {
        try {
            const limit = parseInt(req.query.limit as string) || 100;
            const experiments = await experimentService.getExperiments(limit, 0);

            const exportData = {
                export_timestamp: new Date().toISOString(),
                total_experiments: experiments.length,
                experiments: experiments.map((experiment: ExperimentResult) => ({
                    id: experiment.id,
                    created_at: experiment.created_at,
                    config: experiment.config,
                    response_count: experiment.responses.length,
                    avg_score: experiment.metrics.reduce((sum: number, m: QualityMetrics) => sum + m.overall_score, 0) / experiment.metrics.length
                }))
            };

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="all_experiments_${Date.now()}.json"`);
            res.json(exportData);
        } catch (error) {
            console.error('Error exporting all experiments:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    return router;
};

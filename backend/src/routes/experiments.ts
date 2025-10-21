import { Router, Request, Response } from 'express';
import { ExperimentController } from '../modules/experiment.controller';
import { z } from 'zod';

// Validation schemas
const LLMParametersSchema = z.object({
    temperature: z.number().min(0).max(2),
    top_p: z.number().min(0).max(1),
    max_tokens: z.number().min(1).max(4000),
    frequency_penalty: z.number().min(-2).max(2).optional(),
    presence_penalty: z.number().min(-2).max(2).optional(),
});

const ExperimentConfigSchema = z.object({
    prompt: z.string().min(1).max(10000),
    parameters: z.array(LLMParametersSchema).min(1).max(20),
    model: z.string().min(1),
    iterations: z.number().min(1).max(10),
});

export const experimentRoutes = () => {
    const router = Router();
    const experimentController = new ExperimentController();

    // Create and run experiment
    router.post('/', async (req: Request, res: Response) => {
        try {
            const config = ExperimentConfigSchema.parse(req.body);
            const experiment = await experimentController.runExperiment(config);

            res.status(201).json({
                success: true,
                data: experiment,
                message: 'Experiment created and executed successfully'
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    error: 'Validation error',
                    details: error.errors
                });
                return;
            }

            console.error('Error creating experiment:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Get experiment by ID
    router.get('/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const experiment = await experimentController.getExperiment(id);

            if (!experiment) {
                res.status(404).json({
                    success: false,
                    error: 'Experiment not found'
                });
                return;
            }

            res.json({
                success: true,
                data: experiment
            });
        } catch (error) {
            console.error('Error fetching experiment:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Get all experiments with pagination
    router.get('/', async (req: Request, res: Response) => {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = parseInt(req.query.offset as string) || 0;

            const experiments = await experimentController.getExperiments(limit, offset);

            res.json({
                success: true,
                data: experiments,
                pagination: {
                    limit,
                    offset,
                    count: experiments.length
                }
            });
        } catch (error) {
            console.error('Error fetching experiments:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Delete experiment
    router.delete('/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deleted = await experimentController.deleteExperiment(id);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: 'Experiment not found'
                });
                return;
            }

            res.json({
                success: true,
                message: 'Experiment deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting experiment:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Search experiments
    router.get('/search/:query', async (req: Request, res: Response) => {
        try {
            const { query } = req.params;
            const limit = parseInt(req.query.limit as string) || 20;

            const experiments = await experimentController.searchExperiments(query, limit);

            res.json({
                success: true,
                data: experiments,
                query,
                count: experiments.length
            });
        } catch (error) {
            console.error('Error searching experiments:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Get experiment statistics
    router.get('/stats/overview', async (req: Request, res: Response) => {
        try {
            const stats = await experimentController.getExperimentStats();

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Get comparison data for experiment
    router.get('/:id/comparison', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const experiment = await experimentController.getExperiment(id);

            if (!experiment) {
                res.status(404).json({
                    success: false,
                    error: 'Experiment not found'
                });
                return;
            }

            const comparison = experimentController.generateComparisonData(experiment);

            res.json({
                success: true,
                data: comparison
            });
        } catch (error) {
            console.error('Error generating comparison:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // Generate parameter combinations
    router.post('/generate-parameters', async (req: Request, res: Response) => {
        try {
            const { temperatureRange, topPRange, maxTokens, steps } = req.body;

            const combinations = ExperimentController.generateParameterCombinations(
                temperatureRange || [0.1, 1.5],
                topPRange || [0.1, 1.0],
                maxTokens || 500,
                steps || 3
            );

            res.json({
                success: true,
                data: combinations,
                count: combinations.length
            });
        } catch (error) {
            console.error('Error generating parameters:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    return router;
};

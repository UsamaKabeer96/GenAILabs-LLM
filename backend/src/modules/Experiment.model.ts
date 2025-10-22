import { ExperimentResult } from '../types';
import { ExperimentModel } from '../models/Experiment.model';

export class ExperimentModelService {
    /**
     * Save experiment result to database
     */
    async saveExperiment(experiment: ExperimentResult): Promise<void> {
        try {
            const experimentDoc = new ExperimentModel(experiment);
            await experimentDoc.save();
            console.log(`✅ Experiment ${experiment.id} saved to MongoDB`);
        } catch (error) {
            console.error('Error saving experiment:', error);
            throw error;
        }
    }

    /**
     * Get experiment by ID
     */
    async getExperiment(id: string): Promise<ExperimentResult | null> {
        try {
            const experiment = await ExperimentModel.findOne({ id });
            return experiment ? experiment.toObject() : null;
        } catch (error) {
            console.error('Error getting experiment:', error);
            throw error;
        }
    }

    /**
     * Get all experiments
     */
    async getAllExperiments(): Promise<ExperimentResult[]> {
        try {
            const experiments = await ExperimentModel.find().sort({ created_at: -1 });
            return experiments.map(exp => exp.toObject());
        } catch (error) {
            console.error('Error getting all experiments:', error);
            throw error;
        }
    }

    /**
     * Delete experiment
     */
    async deleteExperiment(id: string): Promise<boolean> {
        try {
            const result = await ExperimentModel.deleteOne({ id });
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting experiment:', error);
            throw error;
        }
    }

    /**
     * Get experiment statistics
     */
    async getExperimentStats(): Promise<any> {
        try {
            const totalExperiments = await ExperimentModel.countDocuments();
            const totalResponses = await ExperimentModel.aggregate([
                { $unwind: '$responses' },
                { $count: 'total' }
            ]);

            return {
                total_experiments: totalExperiments,
                total_responses: totalResponses[0]?.total || 0,
                average_responses_per_experiment: totalExperiments > 0 ? (totalResponses[0]?.total || 0) / totalExperiments : 0
            };
        } catch (error) {
            console.error('Error getting experiment stats:', error);
            throw error;
        }
    }

    /**
     * Search experiments
     */
    async searchExperiments(query: string): Promise<ExperimentResult[]> {
        try {
            const experiments = await ExperimentModel.find({
                $text: { $search: query }
            }).sort({ created_at: -1 });

            return experiments.map(exp => exp.toObject());
        } catch (error) {
            console.error('Error searching experiments:', error);
            throw error;
        }
    }
}
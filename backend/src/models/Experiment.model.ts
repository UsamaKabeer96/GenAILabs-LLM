import mongoose, { Document, Schema } from 'mongoose';
import { ExperimentResult, LLMResponse, QualityMetrics } from '../types';

// LLM Response Schema
const LLMResponseSchema = new Schema<LLMResponse & Document>({
    id: { type: String, required: true },
    text: { type: String, required: true },
    parameters: {
        temperature: { type: Number, required: true },
        top_p: { type: Number, required: true },
        max_tokens: { type: Number, required: true },
        frequency_penalty: { type: Number, default: 0 },
        presence_penalty: { type: Number, default: 0 }
    },
    metadata: {
        tokens_used: { type: Number, required: true },
        finish_reason: { type: String, required: true },
        response_time: { type: Number, required: true }
    }
}, { _id: false });

// Quality Metrics Schema
const QualityMetricsSchema = new Schema<QualityMetrics & Document>({
    coherence_score: { type: Number, required: true },
    completeness_score: { type: Number, required: true },
    length_score: { type: Number, required: true },
    structure_score: { type: Number, required: true },
    overall_score: { type: Number, required: true },
    response_id: { type: String, required: true },
    details: {
        sentence_count: { type: Number, required: true },
        word_count: { type: Number, required: true },
        avg_sentence_length: { type: Number, required: true },
        readability_score: { type: Number, required: true },
        repetition_score: { type: Number, required: true },
        question_count: { type: Number, required: true },
        exclamation_count: { type: Number, required: true }
    }
}, { _id: false });

// Experiment Schema
const ExperimentSchema = new Schema<ExperimentResult & Document>({
    id: { type: String, required: true, unique: true },
    config: {
        prompt: { type: String, required: true },
        parameters: [{
            temperature: { type: Number, required: true },
            top_p: { type: Number, required: true },
            max_tokens: { type: Number, required: true },
            frequency_penalty: { type: Number, default: 0 },
            presence_penalty: { type: Number, default: 0 }
        }],
        model: { type: String, required: true },
        iterations: { type: Number, required: true }
    },
    responses: [LLMResponseSchema],
    metrics: [QualityMetricsSchema],
    created_at: Date,
    updated_at: Date
});

// Create indexes for better performance
ExperimentSchema.index({ id: 1 });
ExperimentSchema.index({ created_at: -1 });
ExperimentSchema.index({ 'config.prompt': 'text' });

// Update the updated_at field before saving
ExperimentSchema.pre('save', function (next) {
    (this as any).updated_at = new Date();
    next();
});

export const ExperimentModel = mongoose.model<ExperimentResult & Document>('Experiment', ExperimentSchema);

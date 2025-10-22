import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMParameters, LLMResponse, ExperimentConfig } from '../../types';
import { config } from '../../config';

export class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;

    constructor() {
        // Don't initialize Gemini client immediately
        // It will be initialized when first used
    }

    private initializeGemini(): void {
        if (!this.genAI) {
            if (!config.gemini.apiKey) {
                throw new Error('Gemini API key is required but not provided');
            }

            this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        }
    }

    /**
     * Generate a single response with given parameters
     */
    async generateResponse(
        prompt: string,
        parameters: LLMParameters,
        model: string = 'gemini-2.0-flash'
    ): Promise<LLMResponse> {
        const startTime = Date.now();

        try {
            // Initialize Gemini client when first used
            this.initializeGemini();

            // Get the generative model
            const generativeModel = this.genAI!.getGenerativeModel({
                model: model,
                generationConfig: {
                    temperature: parameters.temperature,
                    topP: parameters.top_p,
                    maxOutputTokens: parameters.max_tokens,
                }
            });

            // Generate content
            const result = await generativeModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const responseTime = Date.now() - startTime;

            return {
                id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                text: text,
                parameters,
                metadata: {
                    tokens_used: response.usageMetadata?.totalTokenCount || 0,
                    finish_reason: 'stop',
                    response_time: responseTime,
                },
            };
        } catch (error: any) {
            console.error('Error generating Gemini response:', error);

            // Handle specific Gemini errors
            if (error.message?.includes('API_KEY_INVALID')) {
                throw new Error(`Invalid Gemini API key. Please check your API key configuration. Error: ${error.message}`);
            } else if (error.message?.includes('QUOTA_EXCEEDED')) {
                throw new Error(`Gemini API quota exceeded. Please check your usage limits. Error: ${error.message}`);
            } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
                throw new Error(`Gemini API rate limit exceeded. Please try again later. Error: ${error.message}`);
            }

            throw new Error(`Failed to generate response: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Generate multiple responses for an experiment
     */
    async generateExperimentResponses(config: ExperimentConfig): Promise<LLMResponse[]> {
        const responses: LLMResponse[] = [];
        let totalAttempts = 0;
        let successfulResponses = 0;

        for (const parameterSet of config.parameters) {
            for (let i = 0; i < config.iterations; i++) {
                totalAttempts++;
                try {
                    const response = await this.generateResponse(
                        config.prompt,
                        parameterSet,
                        config.model
                    );
                    responses.push(response);
                    successfulResponses++;

                    // Add small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error: any) {
                    console.error(`Error generating response ${totalAttempts}:`, error.message);
                    // Continue with other responses even if one fails
                }
            }
        }
        if (successfulResponses === 0) {
            throw new Error('No responses were generated successfully. Check your Gemini API key and configuration.');
        }

        return responses;
    }

    /**
     * Validate parameters before making API calls
     */
    static validateParameters(parameters: LLMParameters): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (parameters.temperature < 0 || parameters.temperature > 2) {
            errors.push('Temperature must be between 0 and 2');
        }

        if (parameters.top_p < 0 || parameters.top_p > 1) {
            errors.push('Top_p must be between 0 and 1');
        }

        if (parameters.max_tokens < 1 || parameters.max_tokens > 8192) {
            errors.push('Max tokens must be between 1 and 8192');
        }

        if (parameters.frequency_penalty && (parameters.frequency_penalty < -2 || parameters.frequency_penalty > 2)) {
            errors.push('Frequency penalty must be between -2 and 2');
        }

        if (parameters.presence_penalty && (parameters.presence_penalty < -2 || parameters.presence_penalty > 2)) {
            errors.push('Presence penalty must be between -2 and 2');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Get available models
     */
    static getAvailableModels(): string[] {
        return [
            'gemini-2.0-flash',
            'gemini-2.5-pro',
            'gemini-2.5-flash',
            'gemini-2.0-flash-lite'
        ];
    }
}

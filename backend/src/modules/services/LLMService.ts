import OpenAI from 'openai';
import { LLMParameters, LLMResponse, ExperimentConfig } from '../../types';
import { config } from '../../config';

export class LLMService {
    private openai: OpenAI | null = null;

    constructor() {
        // Don't initialize OpenAI client immediately
        // It will be initialized when first used
    }

    private initializeOpenAI(): void {
        if (!this.openai) {
            if (!config.openai.apiKey) {
                console.error('OpenAI API key is missing!');
                console.error('Please check your .env file or environment variables');
                throw new Error('OpenAI API key is required but not provided');
            }

            console.log('Initializing OpenAI client...');
            this.openai = new OpenAI({
                apiKey: config.openai.apiKey,
            });
            console.log('OpenAI client initialized successfully');
        }
    }

    /**
     * Generate a single response with given parameters
     */
    async generateResponse(
        prompt: string,
        parameters: LLMParameters,
        model: string = 'gpt-3.5-turbo'
    ): Promise<LLMResponse> {
        const startTime = Date.now();

        try {
            // Initialize OpenAI client when first used
            this.initializeOpenAI();

            const completion = await this.openai!.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: parameters.temperature,
                top_p: parameters.top_p,
                max_tokens: parameters.max_tokens,
                frequency_penalty: parameters.frequency_penalty || 0,
                presence_penalty: parameters.presence_penalty || 0,
            });

            const responseTime = Date.now() - startTime;
            const choice = completion.choices[0];

            return {
                id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                text: choice.message.content || '',
                parameters,
                metadata: {
                    tokens_used: completion.usage?.total_tokens || 0,
                    finish_reason: choice.finish_reason || 'unknown',
                    response_time: responseTime,
                },
            };
        } catch (error: any) {
            console.error('Error generating LLM response:', error);

            // Handle specific OpenAI errors
            if (error.code === 'insufficient_quota') {
                throw new Error(`OpenAI API quota exceeded. Please check your billing details at https://platform.openai.com/account/billing. Error: ${error.message}`);
            } else if (error.code === 'rate_limit_exceeded') {
                throw new Error(`OpenAI API rate limit exceeded. Please try again later. Error: ${error.message}`);
            } else if (error.code === 'invalid_api_key') {
                throw new Error(`Invalid OpenAI API key. Please check your API key configuration. Error: ${error.message}`);
            } else if (error.status === 429) {
                throw new Error(`OpenAI API rate limit exceeded (429). Please try again later or upgrade your plan. Error: ${error.message}`);
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

        console.log(`🔄 Starting experiment with ${config.parameters.length} parameter sets, ${config.iterations} iterations each`);
        console.log(`📝 Prompt: "${config.prompt.substring(0, 100)}..."`);
        console.log(`🤖 Model: ${config.model}`);

        for (const parameterSet of config.parameters) {
            for (let i = 0; i < config.iterations; i++) {
                totalAttempts++;
                try {
                    console.log(`🔄 Generating response ${totalAttempts}/${config.parameters.length * config.iterations}`);
                    const response = await this.generateResponse(
                        config.prompt,
                        parameterSet,
                        config.model
                    );
                    responses.push(response);
                    successfulResponses++;
                    console.log(`✅ Response ${totalAttempts} generated successfully`);

                    // Add small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error: any) {
                    console.error(`❌ Error generating response ${totalAttempts}:`, error);
                    console.error(`Error details:`, {
                        message: error?.message,
                        name: error?.name,
                        code: error?.code
                    });
                    // Continue with other responses even if one fails
                }
            }
        }

        console.log(`📊 Experiment completed: ${successfulResponses}/${totalAttempts} responses generated`);
        if (successfulResponses === 0) {
            throw new Error('No responses were generated successfully. Check your OpenAI API key and configuration.');
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

        if (parameters.max_tokens < 1 || parameters.max_tokens > 4000) {
            errors.push('Max_tokens must be between 1 and 4000');
        }

        if (parameters.frequency_penalty !== undefined &&
            (parameters.frequency_penalty < -2 || parameters.frequency_penalty > 2)) {
            errors.push('Frequency_penalty must be between -2 and 2');
        }

        if (parameters.presence_penalty !== undefined &&
            (parameters.presence_penalty < -2 || parameters.presence_penalty > 2)) {
            errors.push('Presence_penalty must be between -2 and 2');
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
            'gpt-3.5-turbo',
            'gpt-3.5-turbo-16k',
            'gpt-4',
            'gpt-4-turbo-preview',
            'gpt-4-32k'
        ];
    }
}

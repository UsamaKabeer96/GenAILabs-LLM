import OpenAI from 'openai';
import { LLMParameters, LLMResponse, ExperimentConfig } from '../../types';
import { config } from '../../config';

export class LLMService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: config.openai.apiKey,
        });
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
            // For development/testing without API key
            if (!config.openai.apiKey || config.openai.apiKey === 'mock-key-for-development') {
                return this.generateMockResponse(prompt, parameters);
            }

            const completion = await this.openai.chat.completions.create({
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
        } catch (error) {
            console.error('Error generating LLM response:', error);
            throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate multiple responses for an experiment
     */
    async generateExperimentResponses(config: ExperimentConfig): Promise<LLMResponse[]> {
        const responses: LLMResponse[] = [];

        for (const parameterSet of config.parameters) {
            for (let i = 0; i < config.iterations; i++) {
                try {
                    const response = await this.generateResponse(
                        config.prompt,
                        parameterSet,
                        config.model
                    );
                    responses.push(response);

                    // Add small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error(`Error generating response ${i + 1} for parameter set:`, error);
                    // Continue with other responses even if one fails
                }
            }
        }

        return responses;
    }

    /**
     * Generate mock responses for development/testing
     */
    private generateMockResponse(prompt: string, parameters: LLMParameters): LLMResponse {
        const responses = [
            `This is a comprehensive response to your prompt: "${prompt}". I'll analyze this topic from multiple perspectives. First, let me provide an overview of the key concepts involved. The temperature setting of ${parameters.temperature} affects creativity, while top_p of ${parameters.top_p} controls diversity.`,

            `Here's my detailed analysis of "${prompt}". The parameters you've chosen (temperature: ${parameters.temperature}, top_p: ${parameters.top_p}) will influence the response characteristics. Let me break this down systematically.`,

            `I'll address your question about "${prompt}" with the following considerations. The current parameter configuration shows temperature at ${parameters.temperature} and top_p at ${parameters.top_p}. This creates a specific response pattern that balances creativity and coherence.`,

            `Your prompt "${prompt}" requires careful analysis. Given the parameters (temperature: ${parameters.temperature}, top_p: ${parameters.top_p}), I'll provide a structured response that demonstrates how these settings affect the output quality and style.`,

            `Let me provide a thorough response to "${prompt}". The parameter settings you've chosen (temperature: ${parameters.temperature}, top_p: ${parameters.top_p}) will shape how I approach this topic. I'll ensure the response is both informative and well-structured.`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseTime = Math.random() * 2000 + 500; // 500-2500ms

        return {
            id: `mock_resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text: randomResponse,
            parameters,
            metadata: {
                tokens_used: Math.floor(Math.random() * 200) + 50,
                finish_reason: 'stop',
                response_time: Math.floor(responseTime),
            },
        };
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

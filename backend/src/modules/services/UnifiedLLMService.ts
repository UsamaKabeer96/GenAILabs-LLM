import { LLMParameters, LLMResponse, ExperimentConfig } from '../../types';
import { config } from '../../config';
import { LLMService as OpenAIService } from './LLMService';
import { GeminiService } from './GeminiService';

export class UnifiedLLMService {
    private openaiService: OpenAIService | null = null;
    private geminiService: GeminiService | null = null;
    private provider: 'openai' | 'gemini';

    constructor(provider: 'openai' | 'gemini' = 'gemini') {
        this.provider = provider;
    }

    private getService() {
        if (this.provider === 'openai') {
            if (!this.openaiService) {
                this.openaiService = new OpenAIService();
            }
            return this.openaiService;
        } else {
            if (!this.geminiService) {
                this.geminiService = new GeminiService();
            }
            return this.geminiService;
        }
    }

    /**
     * Generate a single response with given parameters
     */
    async generateResponse(
        prompt: string,
        parameters: LLMParameters,
        model?: string
    ): Promise<LLMResponse> {
        const service = this.getService();

        // Map model names based on provider
        let finalModel = model;

        if (!finalModel) {
            finalModel = this.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.0-flash';
        } else {
            // Map OpenAI model names to Gemini equivalents when using Gemini
            if (this.provider === 'gemini') {
                finalModel = this.mapOpenAIModelToGemini(finalModel);
            }
        }

        return await service.generateResponse(prompt, parameters, finalModel);
    }

    /**
     * Map OpenAI model names to Gemini equivalents
     */
    mapOpenAIModelToGemini(openaiModel: string): string {
        const modelMap: { [key: string]: string } = {
            'gpt-3.5-turbo': 'gemini-2.0-flash',
            'gpt-4': 'gemini-2.0-flash',
            'gpt-4-turbo': 'gemini-2.0-flash',
            'gpt-3.5-turbo-16k': 'gemini-2.0-flash',
        };

        return modelMap[openaiModel] || 'gemini-2.0-flash';
    }

    /**
     * Generate multiple responses for an experiment
     */
    async generateExperimentResponses(config: ExperimentConfig): Promise<LLMResponse[]> {
        const service = this.getService();

        // Apply model mapping to the config
        const mappedConfig = {
            ...config,
            model: this.provider === 'gemini' ? this.mapOpenAIModelToGemini(config.model) : config.model
        };

        return await service.generateExperimentResponses(mappedConfig);
    }

    /**
     * Validate parameters before making API calls
     */
    static validateParameters(parameters: LLMParameters): { valid: boolean; errors: string[] } {
        // Both services use the same validation logic
        return GeminiService.validateParameters(parameters);
    }

    /**
     * Get available models for the current provider
     */
    getAvailableModels(): string[] {
        if (this.provider === 'openai') {
            return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'];
        } else {
            return GeminiService.getAvailableModels();
        }
    }

    /**
     * Switch provider
     */
    switchProvider(provider: 'openai' | 'gemini') {
        this.provider = provider;
    }

    /**
     * Get current provider
     */
    getCurrentProvider(): string {
        return this.provider;
    }
}

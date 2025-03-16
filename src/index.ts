import dotenv from 'dotenv';
import { Provider, ValidationResponse, ValidationResult } from './types';
import { GeminiProvider } from './providers/gemini';

dotenv.config();

/**
 * Main class for ValidAI text validation
 */
export class ValidAI {
    private provider: GeminiProvider;

    /**
     * Creates a new ValidAI instance
     * @param apiKey - API key for the chosen provider
     * @param provider - AI provider to use (currently only supports "gemini")
     * @param model - Model name for the chosen provider
     */
    constructor(apiKey: string, provider: Provider, model: string) {
        if (provider !== "gemini") {
            throw new Error("Currently only Gemini provider is supported");
        }
        this.provider = new GeminiProvider(apiKey, model);
    }

    /**
     * Validates text input for slang and gibberish content
     * @param input - Record of field names to text content
     * @returns Promise containing validation results and overall success status
     * @throws Error if any input field is not a string
     */
    async validate(input: Record<string, any>): Promise<ValidationResponse> {
        const result: Record<string, ValidationResult> = {};
        const textsToValidate: Record<string, string> = {};

        // Validate input types
        for (const key in input) {
            if (typeof input[key] !== "string") {
                throw new Error(`The field ${key} is not a string input, input should contain only string values`);
            }
            textsToValidate[key] = input[key];
        }

        try {
            // Validate texts using the provider
            const validationResults = await this.provider.validate(textsToValidate);
            const success = !Object.values(validationResults).some(result => result.restricted || result.gibbrish);
            
            return {
                success,
                results: validationResults
            };
        } catch (error) {
            console.error(`Error validating inputs: ${error}`);
            // Return error result for all fields
            for (const key in textsToValidate) {
                result[key] = {
                    restricted: false,
                    restrictedReason: "Error validating the text",
                    gibbrish: false,
                    gibbrishReason: "Error validating the text"
                };
            }
            return {
                success: false,
                results: result
            };
        }
    }
}

// Export types for consumers
export * from './types';



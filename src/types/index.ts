/**
 * Interface representing the result of text validation
 */
export interface ValidationResult {
    /** Whether the text contains slang */
    slang: boolean;
    /** Reason why text was flagged as slang, if applicable */
    slangReason: string;
    /** Whether the text contains gibberish */
    gibbrish: boolean;
    /** Reason why text was flagged as gibberish, if applicable */
    gibbrishReason: string;
}

/**
 * Interface representing the complete validation response
 */
export interface ValidationResponse {
    /** Overall validation success status */
    success: boolean;
    /** Detailed validation results for each field */
    results: Record<string, ValidationResult>;
}

/**
 * Supported AI providers
 * Currently only supports Gemini, with plans to add OpenAI and Anthropic
 */
export type Provider = "gemini"; 
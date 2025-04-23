/**
 * Interface representing the result of text validation
 */
export interface ValidationResult {
    /** Whether the text contains slang */
    restricted: boolean;
    /** Reason why text was flagged as slang, if applicable */
    restrictedReason: string;
    /** Whether the text contains gibberish */
    gibbrish: boolean;
    /** Reason why text was flagged as gibberish, if applicable */
    gibbrishReason: string;
    /** Whether the text is valid according to the field name */
    InputValid: boolean;
    /** Reason why text was flagged as invalid, if applicable */
    InputValidReason: string;
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

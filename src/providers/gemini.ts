import { GoogleGenerativeAI } from "@google/generative-ai";
import { ValidationResult } from "../types";

/**
 * Class handling text validation using Google's Gemini AI
 */
export class GeminiProvider {
    private genAI: GoogleGenerativeAI;
    private model: string;

    /**
     * Creates a new GeminiProvider instance
     * @param apiKey - Google API key
     * @param model - Gemini model name
     */
    constructor(apiKey: string, model: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = model;
    }

    /**
     * Validates text content using Gemini AI
     * @param texts - Record of text fields to validate
     * @returns Promise containing validation results for each field
     */
    async validate(texts: Record<string, string>): Promise<Record<string, ValidationResult>> {
        const model = this.genAI.getGenerativeModel({ model: this.model });

        const prompt = `
        Analyze the following texts and determine for each:
        1. if the text contains any offensive words in any language if there are offensive words then reponse this words are restricted and provide the reason for the restriction
        2. if the text contains any gibberish words or spam words or repeated words

        For each text field, provide output in JSON format as follows:
        {
            "fieldName": {
                "Restricted": boolean,
                "RestrictedReason": string,
                "gibbrish": boolean,
                "gibbrishReason": string
            }
        }

        Input texts:
        ${JSON.stringify(texts, null, 2)}
        `;

        const response = await model.generateContent(prompt);
        const result = await response.response.text();
        const cleanedResult = result.replace(/```json|```/g, "").trim();
        
        return JSON.parse(cleanedResult) as Record<string, ValidationResult>;
    }
} 
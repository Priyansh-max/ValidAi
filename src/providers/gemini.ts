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
        3. Validate the text according the field name
           for example if the field name is "name" then validate that the text corresponding to it is a valid name
           if the field name is "email" then validate that the text corresponding to it is a valid email
           if the field name is "phone" then validate that the text corresponding to it is a valid phone number
           if the field name is "address" then validate that the text corresponding to it is a valid address
           if the field name is "zip" then validate that the text corresponding to it is a valid zip code
           if the field name is "city" then validate that the text corresponding to it is a valid city
           if the field name is "state" then validate that the text corresponding to it is a valid state
           if the field name is "country" then validate that the text corresponding to it is a valid country
           return true if the text field is invalid with a reason for the invalidity otherwise return false.

        For each text field, provide output in JSON format as follows:
        {
            "fieldName": {
                "Restricted": boolean,
                "RestrictedReason": string,
                "gibbrish": boolean,
                "gibbrishReason": string
                "InputValid": boolean,
                "InputValidReason": string
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
import { ValidAI } from '../index';
import { ValidationResult } from '../types';

// Mock the GeminiProvider
jest.mock('../providers/gemini', () => {
    return {
        GeminiProvider: jest.fn().mockImplementation(() => ({
            validate: jest.fn().mockImplementation(async (texts: Record<string, string>) => {
                const results: Record<string, ValidationResult> = {};
                for (const [key, value] of Object.entries(texts)) {
                    results[key] = {
                        restricted: value.includes('lol') || value.includes('omg'),
                        restrictedReason: value.includes('lol') ? "Contains slang: 'lol'" : "",
                        gibbrish: value.includes('asdf'),
                        gibbrishReason: value.includes('asdf') ? "Contains gibberish text" : "",
                        InputValid: value.includes('asdf') ? false : true,
                        InputValidReason: value.includes('asdf') ? "Contains gibberish text" : ""
                    };
                }
                return results;
            })
        }))
    };
});

describe('ValidAI', () => {
    let validator: ValidAI;

    beforeEach(() => {
        validator = new ValidAI('fake-api-key', 'gemini', 'gemini-model');
    });

    describe('constructor', () => {
        it('should throw error for unsupported providers', () => {
            expect(() => {
                // @ts-ignore - Testing invalid provider
                new ValidAI('fake-api-key', 'unsupported', 'model');
            }).toThrow('Currently only Gemini provider is supported');
        });

        it('should create instance with valid provider', () => {
            expect(validator).toBeInstanceOf(ValidAI);
        });
    });

    describe('validate', () => {
        it('should validate text input correctly', async () => {
            const input = {
                normal: 'Hello world',
                slang: 'lol what up',
                gibberish: 'asdf keyboard spam',
                email: "asdfddwqdw"
            };

            const result = await validator.validate(input);
            
            expect(result.success).toBe(false); // Because we have slang and gibberish
            expect(result.results.normal.restricted).toBe(false);
            expect(result.results.slang.restricted).toBe(true);
            expect(result.results.gibberish.gibbrish).toBe(true);
            expect(result.results.email.InputValid).toBe(false);
        })

        it('should handle empty input', async () => {
            const input = {};
            const result = await validator.validate(input);
            
            expect(result.success).toBe(true);
            expect(result.results).toEqual({});
        });

        it('should throw error for non-string inputs', async () => {
            const input = {
                text: 'valid text',
                number: 123
            };

            await expect(validator.validate(input)).rejects.toThrow(
                'The field number is not a string input'
            );
        });

        it('should return success true when no slang or gibberish detected', async () => {
            const input = {
                text1: 'This is a proper sentence.',
                text2: 'Another well-formed text.'
            };

            const result = await validator.validate(input);
            expect(result.success).toBe(true);
        });
    });
}); 
import { GeminiProvider } from '../../providers/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI
jest.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
            getGenerativeModel: jest.fn().mockImplementation(() => ({
                generateContent: jest.fn().mockImplementation(async () => ({
                    response: {
                        text: jest.fn().mockImplementation(async () => `{
                            "text1": {
                                "Restricted": false,
                                "RestrictedReason": "",
                                "gibbrish": false,
                                "gibbrishReason": ""
                            },
                            "text2": {
                                "Restricted": true,
                                "RestrictedReason": "Contains offensive words",
                                "gibbrish": false,
                                "gibbrishReason": ""
                            }
                        }`)
                    }
                }))
            }))
        }))
    };
});

describe('GeminiProvider', () => {
    let provider: GeminiProvider;
    let mockGenerateContent: jest.Mock;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        mockGenerateContent = jest.fn();
        (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
            getGenerativeModel: jest.fn().mockReturnValue({
                generateContent: mockGenerateContent
            })
        }));
        provider = new GeminiProvider('fake-api-key', 'gemini-model');
    });

    describe('constructor', () => {
        it('should create instance with API key and model', () => {
            expect(provider).toBeInstanceOf(GeminiProvider);
            expect(GoogleGenerativeAI).toHaveBeenCalledWith('fake-api-key');
        });
    });

    describe('validate', () => {
        it('should call Gemini API and parse response correctly', async () => {
            mockGenerateContent.mockResolvedValueOnce({
                response: {
                    text: async () => `{
                        "text1": {
                            "slang": false,
                            "slangReason": "",
                            "gibbrish": false,
                            "gibbrishReason": ""
                        },
                        "text2": {
                            "slang": true,
                            "slangReason": "Contains slang words",
                            "gibbrish": false,
                            "gibbrishReason": ""
                        }
                    }`
                }
            });

            const texts = {
                text1: 'Hello world',
                text2: 'lol what up'
            };

            const result = await provider.validate(texts);

            expect(result).toHaveProperty('text1');
            expect(result).toHaveProperty('text2');
            expect(result.text1.slang).toBe(false);
            expect(result.text2.slang).toBe(true);
        });

        it('should handle API errors', async () => {
            mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

            const texts = {
                text: 'Hello world'
            };

            await expect(provider.validate(texts)).rejects.toThrow('API Error');
        });

        it('should handle malformed API responses', async () => {
            mockGenerateContent.mockResolvedValueOnce({
                response: {
                    text: async () => 'invalid json'
                }
            });

            const texts = {
                text: 'Hello world'
            };

            await expect(provider.validate(texts)).rejects.toThrow(SyntaxError);
        });
    });
}); 
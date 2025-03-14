# ValidAI

ValidAI is a powerful text validation library that uses AI to detect slang and gibberish content in text. It's perfect for content moderation, form validation, and ensuring high-quality user-generated content.

## Features

- Detect slang words in any language
- Identify gibberish or spam content
- Support for multiple AI providers (currently Gemini, with plans for OpenAI and Anthropic)
- TypeScript support
- Detailed validation results with explanations
- Easy to use API

## Installation

```bash
npm install validai
```

## Usage

```typescript
import { ValidAI } from 'validai';

// Initialize with your API key
const validator = new ValidAI(
    process.env.GEMINI_API_KEY,
    "gemini",
    "gemini-2.0-flash"
);

// Example usage
const userInput = {
    title: "Hello World!",
    description: "This is a test description",
    comment: "lol idk tbh"
};

try {
    const result = await validator.validate(userInput);
    console.log(result);
    /*
    {
        success: false,
        results: {
            title: {
                slang: false,
                slangReason: "",
                gibbrish: false,
                gibbrishReason: ""
            },
            description: {
                slang: false,
                slangReason: "",
                gibbrish: false,
                gibbrishReason: ""
            },
            comment: {
                slang: true,
                slangReason: "Contains internet slang: 'lol', 'idk', 'tbh'",
                gibbrish: false,
                gibbrishReason: ""
            }
        }
    }
    */
} catch (error) {
    console.error('Validation error:', error);
}
```

## API Reference

### `ValidAI`

Main class for text validation.

#### Constructor

```typescript
constructor(apiKey: string, provider: Provider, model: string)
```

- `apiKey`: Your API key for the chosen provider
- `provider`: Currently only supports "gemini"
- `model`: Model name for the chosen provider

#### Methods

##### `validate(input: Record<string, any>): Promise<ValidationResponse>`

Validates the provided text input for slang and gibberish content.

- `input`: Record of field names to text content
- Returns: Promise containing validation results and overall success status

### Types

#### `ValidationResponse`

```typescript
interface ValidationResponse {
    success: boolean;
    results: Record<string, ValidationResult>;
}
```

#### `ValidationResult`

```typescript
interface ValidationResult {
    slang: boolean;
    slangReason: string;
    gibbrish: boolean;
    gibbrishReason: string;
}
```

## Environment Variables

Create a `.env` file in your project root:

```env
GEMINI_API_KEY=your_api_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.



# ValidAI

ValidAI is a powerful text validation library that uses AI to detect offensive and gibberish content in text. It's perfect for content moderation, form validation, and ensuring high-quality user-generated content.
Now you don't have to worry about random content being posted on to your platform by the users. or spend days writing validation rules for your Input fields.

## Features

- Detect offensive words in any language
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
    morecontent: "This is a test content fuck",
    morecontent2: "This is random gibrish fwhqfqwiofhwqhfqwoifhwq",
};

try {
    const result = await validator.validate(userInput);
    console.log(result);
    /*
    {
        success: false,
        results: {
            title: {
                restricted: false,
                restrictedReason: "",
                gibbrish: false,
                gibbrishReason: ""
            },
            description: {
                restricted: false,
                restrictedReason: "",
                gibbrish: false,
                gibbrishReason: ""
            },
            morecontent: {  
                restricted: true,
                restrictedReason: "Contains offensive words: 'fuck'",
                gibbrish: false,
                gibbrishReason: ""
            },
            morecontent2: {
                restricted: false   ,
                restrictedReason: "",
                gibbrish: true,
                gibbrishReason: "Contains gibberish: 'fwhqfqwiofhwqhfqwoifhwq'"
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

Validates the provided text input for offensive and gibberish content.

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
    restricted: boolean;
    restrictedReason: string;
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



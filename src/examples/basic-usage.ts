import { ValidAI } from '..';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
}

// Initialize ValidAI
const validator = new ValidAI(apiKey, "gemini", "gemini-2.0-flash");

// Example inputs to validate
const inputs = {
    normalText: "This is a well-structured English sentence.",
    slangText: "yo dawg wassup lmao",
    gibberishText: "asdfghjkl qwerty keyboard spam",
    mixedText: "Hello world! omg this is gr8"
};

// Run validation
async function runExample() {
    try {
        const result = await validator.validate(inputs);
        console.log('Validation Results:');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

runExample(); 
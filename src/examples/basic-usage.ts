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
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main St, Anytown, USA",
    zip: "12345",
    city: "Anytown",
    state: "CA",
    country: "USA",
    email1: "priyanshagarwal@jklu.edu.in"
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


/*
Output : 
Validation Results:
{
  "success": false,
  "results": {
    "normalText": {
      "Restricted": false,
      "RestrictedReason": "",
      "gibbrish": false,
      "gibbrishReason": ""
    },
    "offensiveText": {
      "Restricted": true,
      "RestrictedReason": "The text contains offensive words: fuck.",
      "gibbrish": false,
      "gibbrishReason": ""
    },
    "gibberishText": {
      "Restricted": false,
      "RestrictedReason": "",
      "gibbrish": true,
      "gibbrishReason": "The text contains gibberish words: asdfghjkl, qwerty."
    },
    "mixedText": {
      "Restricted": false,
      "RestrictedReason": "",
      "gibbrish": false,
      "gibbrishReason": ""
    },
    "moretext": {
      "Restricted": true,
      "RestrictedReason": "The text contains offensive words: bitch.",
      "gibbrish": false,
      "gibbrishReason": ""
    }
  }
}*/
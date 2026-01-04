import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const modelsToTest = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest',
];

console.log('Testing Gemini models...\n');
console.log(`API Key: ${process.env.GEMINI_API_KEY ? 'Set ✓' : 'NOT SET ✗'}\n`);

// First, try to list available models
try {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
  );
  if (response.ok) {
    const data = await response.json();
    const availableModels = data.models?.map(m => m.name?.replace('models/', '')) || [];
    console.log('Available models from API:');
    availableModels.forEach(m => console.log(`  - ${m}`));
    console.log('\n');
  } else {
    console.log('Could not fetch model list from API\n');
  }
} catch (error) {
  console.log('Error fetching model list:', error.message, '\n');
}

// Test each model
for (const modelName of modelsToTest) {
  try {
    console.log(`Testing: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hello in one word');
    const response = await result.response;
    console.log(`✅ ${modelName} WORKS! Response: ${response.text()}\n`);
    process.exit(0); // Exit on first success
  } catch (error) {
    const is404 = error.message?.includes('404') || error.message?.includes('Not Found');
    if (is404) {
      console.log(`❌ ${modelName} - Not found (404)\n`);
    } else {
      console.log(`❌ ${modelName} - Error: ${error.message}\n`);
    }
  }
}

console.log('No working models found. Please check:');
console.log('1. Your API key is valid');
console.log('2. Billing is enabled (some models require it)');
console.log('3. Your region supports these models');








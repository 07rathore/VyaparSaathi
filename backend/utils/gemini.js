import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// List of models to try in order of preference
// Note: Model availability depends on your API key and region
const MODEL_OPTIONS = [
  'gemini-pro',           // Most common, widely available
  'gemini-1.5-pro',       // Newer version
  'gemini-1.5-flash',     // Faster version
  'models/gemini-pro',    // With models/ prefix
  'models/gemini-1.5-pro',
  'models/gemini-1.5-flash',
];

// Cache for working model (to avoid trying all models every time)
let cachedWorkingModel = null;

/**
 * List available models from the API
 */
async function listAvailableModels() {
  try {
    // Import fetch if not available (Node 18+ has it built-in)
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );
    if (response.ok) {
      const data = await response.json();
      const models = data.models?.map(m => {
        // Extract model name (remove 'models/' prefix if present)
        const name = m.name?.replace('models/', '') || m.name;
        return name;
      }).filter(m => m && m.includes('gemini')) || [];
      return models;
    } else {
      const errorText = await response.text();
      console.log('Error fetching models:', errorText);
    }
  } catch (error) {
    console.log('Could not list models:', error.message);
  }
  return [];
}

/**
 * Try to generate content with available models
 */
async function generateWithFallback(prompt) {
  // If we have a cached working model, try it first
  if (cachedWorkingModel) {
    try {
      const model = genAI.getGenerativeModel({ model: cachedWorkingModel });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      // Cached model failed, clear cache and try others
      console.log(`Cached model ${cachedWorkingModel} failed, trying others...`);
      cachedWorkingModel = null;
    }
  }

  // Try to get available models from API
  let availableModels = [];
  try {
    availableModels = await listAvailableModels();
    console.log('Available models from API:', availableModels);
  } catch (error) {
    console.log('Could not fetch available models, using fallback list');
  }

  // Use available models if we got them, otherwise use our fallback list
  const modelsToTry = availableModels.length > 0 
    ? availableModels 
    : MODEL_OPTIONS;

  let lastError = null;
  
  for (const modelName of modelsToTry) {
    try {
      // Clean model name (remove 'models/' prefix if present, SDK handles it)
      const cleanModelName = modelName.replace(/^models\//, '');
      const model = genAI.getGenerativeModel({ model: cleanModelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Cache the working model for future use
      cachedWorkingModel = cleanModelName;
      console.log(`✅ Successfully using model: ${cleanModelName}`);
      
      return response.text();
    } catch (error) {
      // Only log detailed error if it's not a 404 (to reduce noise)
      const is404 = error.message?.includes('404') || error.message?.includes('Not Found');
      if (!is404) {
        console.log(`Model ${modelName} failed:`, error.message);
      }
      lastError = error;
      continue;
    }
  }
  
  // If all models fail, throw the last error
  throw lastError || new Error('No working Gemini model found. Please check your API key and model availability.');
}

export async function explainCompliance(complianceRule, language = 'en') {
  try {
    const languageInstruction = language === 'hi' 
      ? 'Respond in SIMPLE, CONVERSATIONAL Hindi. Use everyday words that first-time smartphone users understand. Avoid complex Sanskrit words. Be warm and reassuring.'
      : 'Use plain, conversational English (no legal jargon)';

    const prompt = `You are a friendly compliance assistant for micro-businesses in India. 
Explain this compliance rule in VERY SIMPLE, NON-THREATENING language:

Rule: ${complianceRule.name}
Description: ${complianceRule.description}
Frequency: ${complianceRule.frequency}
Deadline: ${complianceRule.deadlineDay ? `Day ${complianceRule.deadlineDay} of ${complianceRule.frequency === 'monthly' ? 'each month' : complianceRule.frequency === 'quarterly' ? 'each quarter' : 'each year'}` : 'As per schedule'}
Penalty: ${complianceRule.penaltyDescription || 'Not specified'}

Requirements:
1. ${languageInstruction}
2. Explain in 2-3 sentences maximum
3. Be reassuring and helpful, not scary
4. Clearly state: What they need to do, and By when
5. Mention penalty only if relevant, but in a gentle way (e.g., "A small fee may apply if this is missed")

${language === 'hi' 
  ? 'Response format (in Hindi):\n- आपको क्या करना है: [सरल व्याख्या]\n- कब तक: [समय सीमा]\n- यह क्यों महत्वपूर्ण है: [1 वाक्य आश्वासन]'
  : 'Response format:\n- What you need to do: [simple explanation]\n- By when: [deadline]\n- Why it matters: [1 sentence reassurance]'}`;

    return await generateWithFallback(prompt);
  } catch (error) {
    console.error('Gemini API error:', error);
    // Return a fallback explanation if API fails
    if (language === 'hi') {
      return `आपको ${complianceRule.name} ${complianceRule.frequency} फाइल करना होगा। 
समय सीमा आमतौर पर ${complianceRule.deadlineDay || 7} ${complianceRule.frequency === 'monthly' ? 'हर महीने' : complianceRule.frequency === 'quarterly' ? 'हर तिमाही' : 'हर साल'} है। 
यह आपको अनुपालन में रहने और किसी भी समस्या से बचने में मदद करता है।`;
    }
    return `You need to file ${complianceRule.name} ${complianceRule.frequency}. 
The deadline is typically around the ${complianceRule.deadlineDay || 7}th of ${complianceRule.frequency === 'monthly' ? 'each month' : complianceRule.frequency === 'quarterly' ? 'each quarter' : 'each year'}. 
This helps you stay compliant and avoid any issues.`;
  }
}

export async function chatWithCopilot(userMessage, userContext = {}, language = 'en') {
  try {
    const contextPrompt = userContext.profile 
      ? `User profile: ${userContext.profile.workType}, Income: ${userContext.profile.monthlyIncome}, GST: ${userContext.profile.isGstRegistered ? 'Yes' : 'No'}, State: ${userContext.profile.state}`
      : '';
    
    const languageInstruction = language === 'hi'
      ? 'Respond in SIMPLE, CONVERSATIONAL Hindi. Use everyday words that first-time smartphone users understand. Avoid complex Sanskrit words. Be warm, friendly, and reassuring.'
      : 'Use simple language (no legal jargon). Respond in English.';
    
    const prompt = `You are VyaparSaathi, a friendly and reassuring compliance assistant for micro-businesses, freelancers, and small traders in India.

Your personality:
- Warm, helpful, and non-threatening
- ${languageInstruction}
- Always reassure users
- Focus on solutions, not problems
- Be empathetic about their concerns

${contextPrompt ? `User context: ${contextPrompt}` : ''}

User question: ${userMessage}

Respond in a friendly, conversational tone. Keep it brief (2-4 sentences). Be reassuring and helpful.`;

    return await generateWithFallback(prompt);
  } catch (error) {
    console.error('Gemini API error:', error);
    if (language === 'hi') {
      return "मैं आपकी अनुपालन प्रश्नों में मदद करने के लिए यहाँ हूँ! क्या आप अपना प्रश्न दोबारा लिख सकते हैं? मैं यह सुनिश्चित करना चाहता हूँ कि मैं आपको सबसे अच्छा उत्तर दूं।";
    }
    return "I'm here to help you with compliance questions! Could you rephrase your question? I want to make sure I give you the best answer.";
  }
}



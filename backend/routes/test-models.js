import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Test endpoint to list available models
router.get('/list', async (req, res) => {
  try {
    // Try to fetch available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      const models = data.models || [];
      res.json({
        success: true,
        models: models.map(m => ({
          name: m.name,
          displayName: m.displayName,
          supportedMethods: m.supportedGenerationMethods || []
        }))
      });
    } else {
      const errorText = await response.text();
      res.status(response.status).json({
        success: false,
        error: errorText
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test endpoint to try a specific model
router.post('/test', async (req, res) => {
  const { modelName } = req.body;
  
  if (!modelName) {
    return res.status(400).json({ error: 'Model name is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    res.json({
      success: true,
      model: modelName,
      response: response.text()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      model: modelName,
      error: error.message
    });
  }
});

export default router;








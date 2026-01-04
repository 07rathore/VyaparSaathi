import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { explainCompliance, chatWithCopilot } from '../utils/gemini.js';

const router = express.Router();
const prisma = new PrismaClient();

// Explain a compliance rule
router.post('/explain', authenticate, async (req, res) => {
  try {
    const { ruleId, language = 'en' } = req.body;

    if (!ruleId) {
      return res.status(400).json({ error: 'Rule ID is required' });
    }

    const rule = await prisma.complianceRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule) {
      return res.status(404).json({ error: 'Compliance rule not found' });
    }

    const explanation = await explainCompliance(rule, language);

    res.json({ explanation });
  } catch (error) {
    console.error('AI explain error:', error);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// Chat with copilot
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user context
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    });

    const userContext = {
      profile: profile || null,
    };

    const response = await chatWithCopilot(message, userContext, language);

    res.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to get response from copilot' });
  }
});

export default router;









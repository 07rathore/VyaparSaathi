import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { syncUserComplianceStatuses } from '../utils/complianceEngine.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get onboarding status
router.get('/status', authenticate, async (req, res) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    });

    res.json({
      completed: profile?.onboardingCompleted || false,
      profile: profile || null,
    });
  } catch (error) {
    console.error('Onboarding status error:', error);
    res.status(500).json({ error: 'Failed to get onboarding status' });
  }
});

// Submit onboarding answers
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { workType, monthlyIncome, isGstRegistered, state, city } = req.body;

    if (!workType || !monthlyIncome || isGstRegistered === undefined || !state) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create or update profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: req.userId },
      update: {
        workType,
        monthlyIncome,
        isGstRegistered,
        state,
        city: city || null,
        onboardingCompleted: true,
      },
      create: {
        userId: req.userId,
        workType,
        monthlyIncome,
        isGstRegistered,
        state,
        city: city || null,
        onboardingCompleted: true,
      },
    });

    // Sync compliance statuses
    await syncUserComplianceStatuses(req.userId);

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Onboarding submit error:', error);
    res.status(500).json({ error: 'Failed to save onboarding data' });
  }
});

export default router;









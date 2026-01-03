import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { calculateConfidenceScore, getApplicableCompliances } from '../utils/complianceEngine.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard data
router.get('/', authenticate, async (req, res) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile || !profile.onboardingCompleted) {
      return res.json({
        onboardingRequired: true,
        message: 'Please complete onboarding first',
      });
    }

    // Calculate confidence score
    const confidenceScore = await calculateConfidenceScore(req.userId);

    // Get applicable compliances
    const applicableRules = await getApplicableCompliances(req.userId);

    // Get compliance statuses
    const statuses = await prisma.userComplianceStatus.findMany({
      where: { userId: req.userId },
      include: { rule: true },
      orderBy: { dueDate: 'asc' },
    });

    // Count pending actions
    const now = new Date();
    const pendingCount = statuses.filter(
      (s) => s.status === 'pending' && s.dueDate && new Date(s.dueDate) <= now
    ).length;

    // Get next upcoming deadline
    const upcoming = statuses
      .filter((s) => s.status === 'pending' && s.dueDate && new Date(s.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

    // Determine status message
    let statusMessage = "You're compliant today!";
    if (pendingCount > 0) {
      statusMessage = `${pendingCount} action${pendingCount > 1 ? 's' : ''} pending`;
    } else if (upcoming) {
      const daysUntil = Math.ceil((new Date(upcoming.dueDate) - now) / (1000 * 60 * 60 * 24));
      statusMessage = `Next deadline in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
    }

    // Determine risk level
    let riskLevel = 'low';
    if (confidenceScore < 50) {
      riskLevel = 'high';
    } else if (confidenceScore < 75) {
      riskLevel = 'medium';
    }

    res.json({
      confidenceScore,
      statusMessage,
      riskLevel,
      pendingCount,
      upcoming: upcoming
        ? {
            id: upcoming.id,
            name: upcoming.rule.name,
            dueDate: upcoming.dueDate,
            daysUntil: Math.ceil((new Date(upcoming.dueDate) - now) / (1000 * 60 * 60 * 24)),
          }
        : null,
      totalCompliances: applicableRules.length,
      completedCompliances: statuses.filter((s) => s.status === 'completed').length,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

export default router;









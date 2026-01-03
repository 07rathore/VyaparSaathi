import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get today's actions
router.get('/today', authenticate, async (req, res) => {
  try {
    const statuses = await prisma.userComplianceStatus.findMany({
      where: { userId: req.userId },
      include: { rule: true },
      orderBy: { dueDate: 'asc' },
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const actions = statuses.map((status) => {
      const dueDate = status.dueDate ? new Date(status.dueDate) : null;
      const isOverdue = dueDate && dueDate < today;
      const isDueToday = dueDate && dueDate.toDateString() === today.toDateString();
      const daysUntil = dueDate
        ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
        : null;

      return {
        id: status.id,
        name: status.rule.name,
        description: status.rule.description,
        status: status.status,
        dueDate: status.dueDate,
        completedDate: status.completedDate,
        isOverdue,
        isDueToday,
        daysUntil,
        penalty: status.rule.penaltyDescription,
        frequency: status.rule.frequency,
        ruleId: status.rule.id,
      };
    });

    res.json({ actions });
  } catch (error) {
    console.error('Actions error:', error);
    res.status(500).json({ error: 'Failed to load actions' });
  }
});

// Mark action as completed
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const status = await prisma.userComplianceStatus.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!status) {
      return res.status(404).json({ error: 'Action not found' });
    }

    const updated = await prisma.userComplianceStatus.update({
      where: { id },
      data: {
        status: 'completed',
        completedDate: new Date(),
      },
    });

    res.json({ success: true, status: updated });
  } catch (error) {
    console.error('Complete action error:', error);
    res.status(500).json({ error: 'Failed to mark action as completed' });
  }
});

// Mark action as not applicable
router.post('/:id/not-applicable', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const status = await prisma.userComplianceStatus.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!status) {
      return res.status(404).json({ error: 'Action not found' });
    }

    const updated = await prisma.userComplianceStatus.update({
      where: { id },
      data: {
        status: 'not_applicable',
      },
    });

    res.json({ success: true, status: updated });
  } catch (error) {
    console.error('Not applicable error:', error);
    res.status(500).json({ error: 'Failed to update action' });
  }
});

export default router;


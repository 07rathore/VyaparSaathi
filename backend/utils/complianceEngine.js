import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Determines which compliance rules apply to a user based on their profile
 */
export async function getApplicableCompliances(userId) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile || !profile.onboardingCompleted) {
    return [];
  }

  // Get all compliance rules
  const allRules = await prisma.complianceRule.findMany();

  // Filter rules based on user profile
  const applicableRules = allRules.filter((rule) => {
    // Check work type
    if (rule.applicableWorkTypes) {
      const workTypes = rule.applicableWorkTypes.split(',').map((w) => w.trim());
      if (!workTypes.includes(profile.workType)) {
        return false;
      }
    }

    // Check income range
    if (rule.minIncome || rule.maxIncome) {
      const incomeRanges = {
        '<10k': 5000,
        '10k-50k': 30000,
        '50k-1L': 75000,
        '1L-5L': 300000,
        '>5L': 1000000,
      };
      const userIncome = incomeRanges[profile.monthlyIncome] || 0;
      const minIncome = rule.minIncome ? incomeRanges[rule.minIncome] || 0 : 0;
      const maxIncome = rule.maxIncome ? incomeRanges[rule.maxIncome] || Infinity : Infinity;

      if (userIncome < minIncome || userIncome > maxIncome) {
        return false;
      }
    }

    // Check GST requirement
    if (rule.requiresGst !== null && rule.requiresGst !== undefined) {
      if (rule.requiresGst && !profile.isGstRegistered) {
        return false;
      }
    }

    // Check state
    if (rule.applicableStates) {
      const states = rule.applicableStates.split(',').map((s) => s.trim());
      if (!states.includes(profile.state)) {
        return false;
      }
    }

    return true;
  });

  return applicableRules;
}

/**
 * Calculate compliance confidence score (0-100)
 */
export async function calculateConfidenceScore(userId) {
  const applicableRules = await getApplicableCompliances(userId);
  
  if (applicableRules.length === 0) {
    return 100; // No compliances = fully compliant
  }

  const statuses = await prisma.userComplianceStatus.findMany({
    where: { userId },
    include: { rule: true },
  });

  const now = new Date();
  let totalScore = 0;
  let maxScore = applicableRules.length * 100;

  for (const rule of applicableRules) {
    const status = statuses.find((s) => s.complianceRuleId === rule.id);
    
    if (status?.status === 'completed') {
      totalScore += 100;
    } else if (status?.status === 'not_applicable') {
      totalScore += 100; // Not applicable = compliant
    } else {
      // Pending - check if overdue
      if (status?.dueDate && new Date(status.dueDate) < now) {
        // Overdue - reduce score based on how overdue
        const daysOverdue = Math.floor((now - new Date(status.dueDate)) / (1000 * 60 * 60 * 24));
        const penalty = Math.min(daysOverdue * 5, 50); // Max 50 point penalty
        totalScore += (100 - penalty);
      } else {
        // Pending but not overdue
        totalScore += 70;
      }
    }
  }

  return Math.round((totalScore / maxScore) * 100);
}

/**
 * Get or create compliance statuses for user
 */
export async function syncUserComplianceStatuses(userId) {
  const applicableRules = await getApplicableCompliances(userId);
  
  for (const rule of applicableRules) {
    const existing = await prisma.userComplianceStatus.findUnique({
      where: {
        userId_complianceRuleId: {
          userId,
          complianceRuleId: rule.id,
        },
      },
    });

    if (!existing) {
      // Calculate due date based on frequency
      const dueDate = calculateDueDate(rule);
      
      await prisma.userComplianceStatus.create({
        data: {
          userId,
          complianceRuleId: rule.id,
          status: 'pending',
          dueDate,
        },
      });
    }
  }
}

function calculateDueDate(rule) {
  const now = new Date();
  const dueDate = new Date(now);

  switch (rule.frequency) {
    case 'monthly':
      dueDate.setMonth(now.getMonth() + 1);
      if (rule.deadlineDay) {
        dueDate.setDate(rule.deadlineDay);
      } else {
        dueDate.setDate(7); // Default 7th of next month
      }
      break;
    case 'quarterly':
      dueDate.setMonth(now.getMonth() + 3);
      if (rule.deadlineDay) {
        dueDate.setDate(rule.deadlineDay);
      } else {
        dueDate.setDate(7);
      }
      break;
    case 'annual':
      dueDate.setFullYear(now.getFullYear() + 1);
      if (rule.deadlineMonth) {
        dueDate.setMonth(rule.deadlineMonth - 1);
      }
      if (rule.deadlineDay) {
        dueDate.setDate(rule.deadlineDay);
      } else {
        dueDate.setMonth(6); // July
        dueDate.setDate(31);
      }
      break;
    default:
      dueDate.setMonth(now.getMonth() + 1);
      dueDate.setDate(7);
  }

  return dueDate;
}









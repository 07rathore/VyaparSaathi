import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding compliance rules...');

  const rules = [
    {
      code: 'GST_MONTHLY',
      name: 'GST Monthly Return (GSTR-3B)',
      description: 'Monthly return for GST registered businesses showing summary of sales and purchases',
      category: 'GST',
      applicableWorkTypes: 'shop_owner,small_business',
      requiresGst: true,
      frequency: 'monthly',
      deadlineDay: 20,
      penaltyDescription: 'Late fee of ₹50 per day (max ₹5,000)',
    },
    {
      code: 'GST_QUARTERLY',
      name: 'GST Quarterly Return (GSTR-1)',
      description: 'Quarterly return for GST registered businesses with turnover less than ₹1.5 crore',
      category: 'GST',
      applicableWorkTypes: 'shop_owner,small_business',
      requiresGst: true,
      frequency: 'quarterly',
      deadlineDay: 13,
      penaltyDescription: 'Late fee of ₹50 per day (max ₹5,000)',
    },
    {
      code: 'ITR_ANNUAL',
      name: 'Income Tax Return (ITR)',
      description: 'Annual income tax return filing for individuals and businesses',
      category: 'IncomeTax',
      minIncome: '10k-50k',
      frequency: 'annual',
      deadlineMonth: 7,
      deadlineDay: 31,
      penaltyDescription: 'Late filing fee of ₹5,000 (if income > ₹5L)',
    },
    {
      code: 'TDS_QUARTERLY',
      name: 'TDS Return (Form 26Q)',
      description: 'Quarterly TDS return if you deduct tax at source',
      category: 'IncomeTax',
      applicableWorkTypes: 'small_business',
      minIncome: '1L-5L',
      frequency: 'quarterly',
      deadlineDay: 31,
      penaltyDescription: 'Late fee of ₹200 per day',
    },
    {
      code: 'PF_MONTHLY',
      name: 'EPF Monthly Return',
      description: 'Monthly EPF return if you have employees',
      category: 'Labor',
      applicableWorkTypes: 'small_business',
      frequency: 'monthly',
      deadlineDay: 15,
      penaltyDescription: 'Interest and penalty charges',
    },
    {
      code: 'ESI_MONTHLY',
      name: 'ESI Monthly Return',
      description: 'Monthly ESI return if you have 10+ employees',
      category: 'Labor',
      applicableWorkTypes: 'small_business',
      frequency: 'monthly',
      deadlineDay: 15,
      penaltyDescription: 'Penalty for late filing',
    },
    {
      code: 'SHOP_ACT',
      name: 'Shop & Establishment Act Registration',
      description: 'Registration under state Shop & Establishment Act for commercial establishments',
      category: 'Labor',
      applicableWorkTypes: 'shop_owner,small_business',
      frequency: 'annual',
      deadlineMonth: 12,
      deadlineDay: 31,
      penaltyDescription: 'Fine as per state rules',
    },
  ];

  for (const rule of rules) {
    await prisma.complianceRule.upsert({
      where: { code: rule.code },
      update: rule,
      create: rule,
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });









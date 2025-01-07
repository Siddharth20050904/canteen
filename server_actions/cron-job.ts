"use server";

import { PrismaClient } from "@prisma/client";
import cron from 'node-cron';

const prisma = new PrismaClient();

export async function deletionJobScheduler() {
  const yesterday = new Date();
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);

  cron.schedule('0 0 * * *', async () => {
    try {
      const result = await prisma.recent_activity.deleteMany({
        where: {
          timestamp: {
            lt: yesterday,
          },
        },
      });
      console.log(`Deleted ${result.count} old activity records`);
    } catch (error) {
      console.error('Error deleting old activity records:', error);
    }
  });

  console.log('Cron job scheduled to delete old activity records at midnight.');
}

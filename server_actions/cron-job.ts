"use server";

import { PrismaClient } from "@prisma/client";
import cron from 'node-cron';

const prisma = new PrismaClient();

export async function deletionJobScheduler(){
  
// Schedule the job to run at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const result = await prisma.recent_activity.deleteMany({
      where: {
        timestamp: {
          lt: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
    });
    console.log(`Deleted ${result.count} old activity records`);
  } catch (error) {
    console.error('Error deleting old activity records:', error);
  } finally {
    await prisma.$disconnect();
  }
});

console.log('Cron job scheduled to delete old activity records at midnight.');


}
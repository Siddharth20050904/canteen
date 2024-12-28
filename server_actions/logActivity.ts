"use server";

import { PrismaClient } from "@prisma/client";  

const prisma = new PrismaClient();

export async function logActivity(userId: string, action: string, type: string) {
  try {
    const newActivity = await prisma.recent_activity.create({
      data: {
        userId,
        activity:action,
        type,
      },
    });
    console.log("Activity logged:", newActivity);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

export async function recentActivityByUserId(userId: string) {
  try {
    const activities = await prisma.recent_activity.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    return activities;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}


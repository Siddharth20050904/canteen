'use server'

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function markAttendance(userId: string, mealId: string, status: 'present' | 'absent') {
  try {
    // Add your database query here using your preferred DB client
    // Example with prisma:
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        mealId,
        status,
        markedAt: new Date()
      }
    });
    return attendance;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
}

export async function getAttendance(userId: string) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  console.log(todayStart);
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        userId: userId,
        markedAt: {
          gte: todayStart
        }
      }
    });
    return attendance;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}

export async function getWeekAttendance() {
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        markedAt: {
          gte: startOfWeek
        }
      }
    });
    return attendance;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}
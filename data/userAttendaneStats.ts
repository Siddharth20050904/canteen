"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAttendanceStatsByUserId(userId: string) {
  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        userId: userId,
      },
    });

    const presentAttendance = attendanceRecords.filter(record => record.status === 'present').length;
    const absentAttendance = attendanceRecords.filter(record => record.status === 'absent').length;

    return {
      present: presentAttendance,
      total: absentAttendance + presentAttendance,
    };
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}
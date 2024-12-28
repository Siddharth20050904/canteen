"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTotalReviewsByUserId(userId: string) {
  try {
    const reviewCount = await prisma.review.count({
      where: {
        userId: userId,
      },
    });

    return reviewCount;
  } catch (error) {
    console.error('Error fetching review count:', error);
    throw error;
  }
}

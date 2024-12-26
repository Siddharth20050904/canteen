"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchReviews() {
  try {
    const reviews = await prisma.review.findMany();
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}
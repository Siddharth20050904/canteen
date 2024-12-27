"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTopThreeSuggestions() {
  try {
    const suggestions = await prisma.suggestion.findMany({
      orderBy: {
        likes: 'desc'
      },
      take: 3
    });
    return suggestions;
  } catch (error) {
    console.error("Error fetching top suggestions:", error);
    return null;
  }
}
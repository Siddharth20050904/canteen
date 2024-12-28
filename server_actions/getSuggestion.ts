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

export async function getAllSuggestions() {
  try {
    const suggestions = await prisma.suggestion.findMany({});
    return suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return null;
  }
}

export interface Suggestion {
  id: number;
  mealType: string;
  name: string;
  description: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  userId: string;
  status: string;
}

export async function getTopThreeSuggestionsByUserId(userId: string): Promise<Suggestion[] | null> {
  try {
    const suggestions: Suggestion[] = await prisma.suggestion.findMany({
      where: {
        userId: userId.toString()
      },
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
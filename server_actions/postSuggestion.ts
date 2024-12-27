"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function postSuggestion(formData: FormData) {
  const dish_name = formData.get("dish") as string | null;
  const category = formData.get("category") as string | null;
  const description = formData.get("description") as string | null;
  const userId = formData.get("userId") as string | null;
    try {
        const suggestion = await prisma.suggestion.create({
            data: {
                name: dish_name || '',
                mealType: category || '',
                description: description || '',
                userId: userId || ''
            }
        });
        if (!suggestion) {
            return {success: false, message: 'Failed to post suggestion'};
        }
        return {success: true, message: 'Suggestion posted successfully'};
    } catch (error) {
        console.error(error);
    }
}
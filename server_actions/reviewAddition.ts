"use server";

import { PrismaClient } from "@prisma/client";

// Best practice: Create a single PrismaClient instance
const prisma = new PrismaClient();

export async function addReview(review: { 
    meal: string,
    rating: number,
    comment: string,
    category: string,
    userId: string,
    day: string
}) {
    try {
        // Input validation
        if (!review.meal || !review.rating || !review.userId || !review.day) {
            throw new Error("Missing required fields");
        }

        const newReview = await prisma.review.create({
            data: {
                mealType: review.meal,
                rating: review.rating,
                comment: review.comment || "", // Handle empty comments
                category: review.category,
                userId: review.userId,
                day: review.day
            },
        });

        return { success: true, data: newReview };
    } catch (error) {
        console.error("Error creating review:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to submit review"
        };
    } finally {
        // Clean up connection
        await prisma.$disconnect();
    }
}
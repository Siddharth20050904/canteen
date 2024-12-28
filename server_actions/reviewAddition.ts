"use server";

import { PrismaClient } from "@prisma/client";

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

        // Fetch current rating and number of reviews for the meal
        const menu = await prisma.menu.findFirst({
            where: { mealType: review.meal, day: review.day},
        });

        if (!menu) {
            throw new Error("No menu found for this meal");
        }

        if (!(menu[review.category as keyof typeof menu])) {
            throw new Error(`Menu does not have a valid ${review.category}`);
        }

        // Create new review
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

        

        if (!menu) {
            throw new Error("Meal not found in menu");
        }

        // Calculate new average rating
        const newReviewCount = menu.reviewCount + 1;
        const newAverageRating = (((menu.rating ?? 0) * menu.reviewCount) + review.rating) / newReviewCount;

        // Update menu with new average rating and review count
        await prisma.menu.update({
            where: { id: menu.id ,mealType: review.meal },
            data: {
                rating: newAverageRating,
                reviewCount: newReviewCount
            }
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
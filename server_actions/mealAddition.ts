// src/app/login/loginActions.ts
'use server';
import { sendMenuUpdates } from './emailActions';
import { getUserWithEmailNotification } from './userFetch';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Server action to handle meal addition
export async function addMeal(data: { dish: string; category: string; day: string; mealType: string }) {
  const { dish, category, day, mealType } = data;

  try {
    // Find the existing meal for the given day and mealType
    const meal = await prisma.menu.findFirst({
      where: { day: day, mealType: mealType },
    });

    if (meal) {
      // If a meal exists, update the appropriate category with the new dish
      const updateData: { [key: string]: string } = {}; // Initialize an empty object to hold the updated field
      updateData[category] = dish; // Dynamically set the category field to the dish name

      await prisma.menu.update({
        where: { id: meal.id },
        data: updateData, // Update only the specified category field
      });

    } else {
      // If no meal exists, create a new one and assign the dish to the correct category
      await prisma.menu.create({
        data: {
          day: day,
          mealType: mealType,
          mainCourse: category === 'mainCourse' ? dish : '',
          sideDish: category === 'sideDish' ? dish : '',
          dessert: category === 'dessert' ? dish : '',
          beverage: category === 'beverage' ? dish : '',
        },
      });
    }

    const users = await getUserWithEmailNotification();

    const userEmails = users?.map((user) => user.email) || [];
    try {
      await sendMenuUpdates(userEmails, {dish, category, day, mealType});
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, message: 'Meal added but email notifications failed' };
    }

    return { success: true, message: 'Meal added successfully' };
  } catch (error) {
    console.error('Menu Addition Error:', error);
    return { success: false, message: 'An error occurred during addition of meal' };
  }
}

"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateUserProfile = async (
  userId: string,
  name: string,
  rollNumber: string,
  preferences: string,
) => {
  try {
    console.log('Updating user profile with:', { userId, name, rollNumber, preferences });
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        rollNumber: rollNumber,
        preferences: preferences,
      },
    });
    console.log('User profile updated successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserInfo = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
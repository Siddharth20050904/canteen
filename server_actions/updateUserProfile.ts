"use server";

import { PrismaClient } from "@prisma/client";
import { generateOTP } from "./registerActions";
import bcrypt from 'bcryptjs';

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



export async function updateMenuNotificationPreference(
  userId: string, 
  menuUpdates: boolean
) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      menuNotifications: menuUpdates
    }
  })
  return updatedUser
}

export async function updateOTP(email: string) {
  const otp = await generateOTP();
  const otpGeneratedAt = new Date();
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpGeneratedAt,
        otpVerified: false,
      }
    });
    return { otp, id: user.id };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export async function resetPassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { success: true, message: 'Password reset successful' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: 'Failed to reset password' };
  }
}
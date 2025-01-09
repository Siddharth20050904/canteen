"use server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

export async function verifyOTP(id: string, otp: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user || user.otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    const currentTime = new Date().getTime();
    if (!user.otpGeneratedAt) {
      return { success: false, message: 'OTP generation time is missing' };
    }
    const otpGeneratedTime = new Date(user.otpGeneratedAt).getTime();

    if (currentTime - otpGeneratedTime > OTP_EXPIRATION_TIME) {
      return { success: false, message: 'OTP has expired' };
    }

    await prisma.user.update({
      where: { id },
      data: { otpVerified: true, otp: null, otpGeneratedAt: null },
    });



    return { success: true, message: 'Email verified successfully'};
  } catch (error) {
    console.error('OTP verification error:', error);
    return { success: false, message: 'An error occurred during OTP verification' };
  }
}
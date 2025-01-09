"use server";

import bcrypt from 'bcryptjs';
import { sendOTPEmail } from './emailActions';

import { PrismaClient as PrismaClientType } from '@prisma/client';

let PrismaClient;
if (typeof window === 'undefined') {
  // Only assign PrismaClient in a Node.js environment
  PrismaClient = PrismaClientType;
}

function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

const prisma = PrismaClient ? new PrismaClient() : null;

export async function registerUser(data: { name: string; email: string; password: string }) {
  const { name, email, password } = data;
  if (!prisma) {
    return { success: false, message: 'PrismaClient is not available in this environment' };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpGeneratedAt = new Date();

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        otp,
        otpGeneratedAt,
        otpVerified: false,
      },
    });

    await sendOTPEmail(email, otp);

    return { success: true, message: 'User created successfully. Please verify your email.', id: newUser.id };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'An error occurred during registration' };
  }
}
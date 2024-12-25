// src/app/login/loginActions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Server action to handle login
export async function loginUser(data: { email: string; password: string }) {
  const { email, password } = data;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return { success: true, message: 'Login successful', user };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

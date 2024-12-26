'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchMenu() {
  try {
    const menu = await prisma.menu.findMany();
    return menu;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
}
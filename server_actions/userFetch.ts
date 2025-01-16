"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    return user
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}


export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })
    return user;
  }
  catch (error) {
    console.error("Error fetching user by id:", error)
    return null;
  }
}

export async function getUserWithEmailNotification(){
  try {
    const user = await prisma.user.findMany({
      where: {
        menuNotifications: true
      }
    })
    return user;
  }
  catch (error) {
    console.error("Error fetching user by id:", error)
    return null;
  }
}
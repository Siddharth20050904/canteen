'use server'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isValid = await bcrypt.compare(currentPassword, user.password!)
  if (!isValid) {
    throw new Error('Current password is incorrect')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })

  return updatedUser
}

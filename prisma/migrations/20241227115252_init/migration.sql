/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "mealType" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suggestion" (
    "id" SERIAL NOT NULL,
    "mealType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_likedSuggestion" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_likedSuggestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_dislikedSuggestion" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_dislikedSuggestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Attendance_userId_idx" ON "Attendance"("userId");

-- CreateIndex
CREATE INDEX "Attendance_mealId_idx" ON "Attendance"("mealId");

-- CreateIndex
CREATE INDEX "_likedSuggestion_B_index" ON "_likedSuggestion"("B");

-- CreateIndex
CREATE INDEX "_dislikedSuggestion_B_index" ON "_dislikedSuggestion"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedSuggestion" ADD CONSTRAINT "_likedSuggestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Suggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedSuggestion" ADD CONSTRAINT "_likedSuggestion_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikedSuggestion" ADD CONSTRAINT "_dislikedSuggestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Suggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikedSuggestion" ADD CONSTRAINT "_dislikedSuggestion_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

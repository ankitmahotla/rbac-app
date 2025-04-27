/*
  Warnings:

  - You are about to drop the column `passwordResetExpiry` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordResetExpiry",
ADD COLUMN     "passwordResetTokenExpiry" TEXT,
ADD COLUMN     "verificationTokenExpiry" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

/*
  Warnings:

  - The `passwordResetTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `verificationTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordResetTokenExpiry",
ADD COLUMN     "passwordResetTokenExpiry" TIMESTAMP(3),
DROP COLUMN "verificationTokenExpiry",
ADD COLUMN     "verificationTokenExpiry" TIMESTAMP(3);

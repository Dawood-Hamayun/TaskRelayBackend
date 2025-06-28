/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedBy` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invitedBy" TEXT NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

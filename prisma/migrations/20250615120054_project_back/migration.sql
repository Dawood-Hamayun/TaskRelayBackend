/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `invitedBy` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_invitedBy_fkey";

-- DropIndex
DROP INDEX "Invite_token_key";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "expiresAt",
DROP COLUMN "invitedBy",
DROP COLUMN "message",
DROP COLUMN "status",
DROP COLUMN "token";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description";

-- DropEnum
DROP TYPE "InviteStatus";

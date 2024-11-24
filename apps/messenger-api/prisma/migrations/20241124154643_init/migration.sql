/*
  Warnings:

  - You are about to drop the column `sender_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `thread_id` on the `messages` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_thread_id_fkey";

-- DropIndex
DROP INDEX "messages_created_at_idx";

-- DropIndex
DROP INDEX "messages_sender_id_idx";

-- DropIndex
DROP INDEX "messages_thread_id_idx";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "sender_id",
DROP COLUMN "thread_id",
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "threadId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "messages_threadId_idx" ON "messages"("threadId");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "edited" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "token" DROP NOT NULL;

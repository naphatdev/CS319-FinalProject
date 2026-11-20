-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable (existing rows get an unusable hash until re-seeded)
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;

-- CreateEnum
CREATE TYPE "PlaceCategory" AS ENUM ('CAFE', 'LIBRARY', 'PARK', 'COWORKING', 'BENCH', 'OTHER');

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "category" "PlaceCategory" NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

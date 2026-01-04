-- CreateEnum
CREATE TYPE "SpotCategory" AS ENUM ('CAFE', 'LIBRARY', 'PARK', 'COWORKING', 'OTHER');

-- CreateTable
CREATE TABLE "RestSpot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "category" "SpotCategory" NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestSpot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestSpot_placeId_key" ON "RestSpot"("placeId");

-- CreateIndex
CREATE INDEX "RestSpot_latitude_longitude_idx" ON "RestSpot"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "RestSpot_category_idx" ON "RestSpot"("category");

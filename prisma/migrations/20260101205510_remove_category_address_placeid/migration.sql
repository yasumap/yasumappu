-- DropIndex
DROP INDEX IF EXISTS "RestSpot_category_idx";

-- AlterTable
ALTER TABLE "RestSpot" DROP COLUMN IF EXISTS "address",
DROP COLUMN IF EXISTS "category",
DROP COLUMN IF EXISTS "placeId";

-- DropEnum
DROP TYPE IF EXISTS "SpotCategory";

-- AlterTable
ALTER TABLE "Mashup" ADD COLUMN "audioKey" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;

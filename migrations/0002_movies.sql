-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "releaseDate" DATETIME
);

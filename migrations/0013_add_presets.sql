-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Preset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "movie1Id" TEXT NOT NULL,
    "movie2Id" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Preset_movie1Id_fkey" FOREIGN KEY ("movie1Id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Preset_movie2Id_fkey" FOREIGN KEY ("movie2Id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mashup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "movie1Id" TEXT NOT NULL,
    "movie2Id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "plot" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    CONSTRAINT "Mashup_movie1Id_fkey" FOREIGN KEY ("movie1Id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mashup_movie2Id_fkey" FOREIGN KEY ("movie2Id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Mashup" ("createdAt", "id", "imageKey", "movie1Id", "movie2Id", "plot", "tagline", "title") SELECT "createdAt", "id", "imageKey", "movie1Id", "movie2Id", "plot", "tagline", "title" FROM "Mashup";
DROP TABLE "Mashup";
ALTER TABLE "new_Mashup" RENAME TO "Mashup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

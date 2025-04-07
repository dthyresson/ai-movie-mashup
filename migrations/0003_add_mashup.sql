-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Mashup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "movie1Id" TEXT NOT NULL,
    "movie2Id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "plot" TEXT NOT NULL,
    "movieId" TEXT,
    CONSTRAINT "Mashup_movie1Id_fkey" FOREIGN KEY ("movie1Id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mashup_movie2Id_fkey" FOREIGN KEY ("movie2Id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;

-- CreateIndex
CREATE UNIQUE INDEX "Preset_movie1Id_movie2Id_key" ON "Preset"("movie1Id", "movie2Id");

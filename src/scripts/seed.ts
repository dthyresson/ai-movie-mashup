import { defineScript } from "@redwoodjs/sdk/worker";
import { db, setupDb } from "@/db";
import { MOVIES } from "./movies";
import { PRESET_MASHUPS } from "./presets";
export default defineScript(async ({ env }) => {
  setupDb(env);

  await db.$executeRawUnsafe(`\
    DELETE FROM User;
    DELETE FROM Credential;
    DELETE FROM Mashup;
    DELETE FROM Preset;
    DELETE FROM Movie;
    DELETE FROM sqlite_sequence;
  `);

  await db.user.create({
    data: {
      id: "1",
      username: "testuser",
    },
  });

  await db.movie.createMany({
    data: MOVIES.map((movie) => ({
      id: movie.id,
      title: movie.title,
      photo: movie.photo,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
    })),
  });

  // Create presets
  await db.preset.createMany({
    data: PRESET_MASHUPS.map((preset) => ({
      movie1Id: preset.movie1Id,
      movie2Id: preset.movie2Id,
      isFavorite: preset.isFavorite,
    })),
  });

  console.log("🌱 Finished seeding");
});

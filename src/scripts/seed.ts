import { defineScript } from "@redwoodjs/sdk/worker";
import { db, setupDb } from "@/db";
import { MOVIES } from "./movies";
export default defineScript(async ({ env }) => {
  setupDb(env);

  await db.$executeRawUnsafe(`\
    DELETE FROM User;
    DELETE FROM Credential;
    DELETE FROM Mashup;
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

  console.log("🌱 Finished seeding");
});

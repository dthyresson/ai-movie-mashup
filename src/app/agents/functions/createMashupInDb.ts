import { db } from "@/db";

export const createMashupInDb = async (
  title: string,
  tagline: string,
  plot: string,
  imageKey: string,
  imageDescription: string,
  audioKey: string,
  movie1: string,
  movie2: string,
) => {
  const mashup = await db.mashup.create({
    data: {
      title,
      tagline,
      plot,
      imageKey,
      imageDescription,
      audioKey,
      movie1: {
        connect: {
          id: movie1,
        },
      },
      movie2: {
        connect: {
          id: movie2,
        },
      },
      status: "COMPLETED",
    },
  });

  console.log(`created mashup: ${mashup.title}`);
  return mashup;
};

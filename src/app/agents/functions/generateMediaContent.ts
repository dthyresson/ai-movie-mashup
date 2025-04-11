import { Connection } from "agents";
import { generatePoster, generateAudioContent } from "./index";

export const generateMediaContent = async (
  connection: Connection,
  model: any,
  title: string,
  tagline: string,
  plot: string,
) => {
  return await Promise.all([
    generatePoster(connection, model, title, tagline, plot),
    generateAudioContent(connection, title, tagline, plot),
  ]);
};

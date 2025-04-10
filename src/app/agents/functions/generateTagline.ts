import { Connection } from "agents";
import { getMashupTaglinePrompt, streamTextAndUpdateState } from "./index";

export const generateTagline = async (
  connection: Connection,
  model: any,
  title: string,
  movie1Data: any,
  movie2Data: any,
) => {
  const {
    systemPrompt: taglineSystemPrompt,
    userPrompt: taglineUserPrompt,
    assistantPrompt: taglineAssistantPrompt,
  } = getMashupTaglinePrompt(title, movie1Data, movie2Data);

  return await streamTextAndUpdateState(
    connection,
    model,
    taglineSystemPrompt,
    taglineUserPrompt,
    taglineAssistantPrompt,
    "tagline",
    "",
    512,
  );
};

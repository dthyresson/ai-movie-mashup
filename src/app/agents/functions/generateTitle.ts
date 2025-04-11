import { Connection } from "agents";
import { getMashupTitlePrompt, streamTextAndUpdateState } from "./index";

export const generateTitle = async (
  connection: Connection,
  model: any,
  movie1Data: any,
  movie2Data: any,
) => {
  const {
    systemPrompt: titleSystemPrompt,
    userPrompt: titleUserPrompt,
    assistantPrompt: titleAssistantPrompt,
  } = getMashupTitlePrompt(movie1Data, movie2Data);

  return await streamTextAndUpdateState(
    connection,
    model,
    titleSystemPrompt,
    titleUserPrompt,
    titleAssistantPrompt,
    "title",
    "",
  );
};

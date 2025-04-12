import { Connection } from "agents";
import { getMashupTitlePrompt, streamAndReturnCompleteText } from "./index";

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

  return await streamAndReturnCompleteText(
    connection,
    model,
    titleSystemPrompt,
    titleUserPrompt,
    titleAssistantPrompt,
    "title",
    "",
  );
};

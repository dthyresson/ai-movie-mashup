import { Connection } from "agents";
import { getMashupPlotPrompt, streamTextAndUpdateState } from "./index";

export const generatePlot = async (
  connection: Connection,
  model: any,
  title: string,
  tagline: string,
  movie1Data: any,
  movie2Data: any,
) => {
  const {
    systemPrompt: plotSystemPrompt,
    userPrompt: plotUserPrompt,
    assistantPrompt: plotAssistantPrompt,
  } = getMashupPlotPrompt(title, tagline, movie1Data, movie2Data);

  return await streamTextAndUpdateState(
    connection,
    model,
    plotSystemPrompt,
    plotUserPrompt,
    plotAssistantPrompt,
    "plot",
    "",
  );
};

export const TEXT_GENERATION_MODEL = "@cf/meta/llama-2-7b-chat-int8";
export const DEFAULT_GATEWAY_ID = "default";

export * from "./mashupMovies";
export * from "./getMoviesToMash";
export * from "./generateTitle";
export * from "./generateTagline";
export * from "./generatePlot";
export * from "./generateMediaContent";
export * from "./createMashupInDb";
export * from "./generatePoster";
export * from "./generateAudioContent";
export * from "./streamTextAndUpdateState";
export * from "./prompts";

// faster, more $ "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
export const IMAGE_GENERATION_MODEL = "@cf/black-forest-labs/flux-1-schnell";
export const TTS_MODEL = "@cf/myshell-ai/melotts";

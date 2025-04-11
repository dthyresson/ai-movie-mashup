export { streamTextAndUpdateState } from "./streamTextAndUpdateState";
export { generatePoster } from "./generatePoster";
export { generateAudioContent } from "./generateAudioContent";
export { mashupMovies } from "./mashupMovies";

// faster, more $ "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
export const TEXT_GENERATION_MODEL = "@cf/meta/llama-3.1-8b-instruct";
export const IMAGE_GENERATION_MODEL = "@cf/black-forest-labs/flux-1-schnell";
export const TTS_MODEL = "@cf/myshell-ai/melotts";
export const DEFAULT_GATEWAY_ID = "default";

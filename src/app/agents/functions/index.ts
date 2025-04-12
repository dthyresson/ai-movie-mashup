export * from "./mashupMovies";
export * from "./getMoviesToMash";
export * from "./generateTitle";
export * from "./generateTagline";
export * from "./generatePlot";
export * from "./generateMediaContent";
export * from "./createMashupInDb";
export * from "./generatePoster";
export * from "./generateAudioContent";
export * from "./helpers";

// AI Gateway ID for logging, caching, and rate limiting
export const DEFAULT_GATEWAY_ID = "default";

// fast! and cheaper but not great: "@cf/meta/llama-3.2-1b-instruct";
// better, but pricier: "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
export const TEXT_GENERATION_MODEL = "@cf/meta/llama-3.2-3b-instruct";
export const IMAGE_GENERATION_MODEL = "@cf/black-forest-labs/flux-1-schnell";
export const TTS_MODEL = "@cf/myshell-ai/melotts";

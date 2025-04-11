export interface MessageData {
  title?: string;
  tagline?: string;
  plot?: string;
  imageKey?: string;
  imageDescription?: string;
  audioKey?: string;
}

export interface MessageLog {
  raw: string;
  parsed: MessageData;
}

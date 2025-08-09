export const FINE_TUNING_MODEL_OPTIONS = [
  {
    label: "gpt-3.5-turbo-1106 (recommended)",
    value: "gpt-3.5-turbo-1106",
  },
  {
    label: "gpt-3.5-turbo-0613",
    value: "gpt-3.5-turbo-0613",
  },
  {
    label: "babbage-002",
    value: "babbage-002",
  },
  {
    label: "davinci-002",
    value: "davinci-002",
  },
  {
    label: "gpt-4-0613 (experimental — eligible users will be presented with an option to request access in the fine-tuning UI)",
    value: "gpt-4-0613",
  },
  {
    label: "gpt-4.1-mini-2025-04-14",
    value: "gpt-4.1-mini-2025-04-14",
  },
  {
    label: "gpt-4.1-2025-04-14",
    value: "gpt-4.1-2025-04-14",
  },
];

export const TTS_MODELS = [
  "tts-1",
  "tts-1-hd",
];

export const IMAGE_MODELS = [
  "dall-e-2",
  "dall-e-3",
];

export const MODERATION_MODELS = [
  "text-moderation-stable",
  "text-moderation-latest",
];

// Models that are eligible for Assistants API usage when selecting an Assistant model
export const ASSISTANTS_MODEL_INCLUDE_SUBSTRINGS = [
  "gpt-3.5-turbo",
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-4.1",
  "gpt-5",
  "gpt-5-mini",
  "gpt-5-nano",
];

// Exact model IDs to exclude from Assistants model options
export const ASSISTANTS_MODEL_EXCLUDED = [
  "gpt-3.5-turbo-0301",
];

// Supported models in the "Chat using Web Search" action
export const WEB_SEARCH_CHAT_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
];

// Supported models in the "Create Transcription" action
export const TRANSCRIPTION_MODELS = [
  "gpt-4o-transcribe",
  "gpt-4o-mini-transcribe",
  "whisper-1",
];

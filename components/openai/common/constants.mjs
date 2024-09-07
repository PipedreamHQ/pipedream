const FINE_TUNING_MODEL_OPTIONS = [
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
];

const TTS_MODELS = [
  "tts-1",
  "tts-1-hd",
];

const IMAGE_MODELS = [
  "dall-e-2",
  "dall-e-3",
];

const MODERATION_MODELS = [
  "text-moderation-stable",
  "text-moderation-latest",
];

const AUDIO_RESPONSE_FORMATS = [
  "mp3",
  "opus",
  "aac",
  "flac",
  "wav",
  "pcm",
];

const CHAT_RESPONSE_FORMAT = {
  TEXT: {
    label: "Text",
    value: "text",
  },
  JSON_OBJECT: {
    label: "JSON Object",
    value: "json_object",
  },
  JSON_SCHEMA: {
    label: "JSON Schema",
    value: "json_schema",
  },
};

const IMAGE_RESPONSE_FORMATS = [
  {
    label: "URL",
    value: "url",
  },
  {
    label: "Write file to /tmp directory",
    value: "tmp",
  },
  {
    label: "Base64 JSON",
    value: "b64_json",
  },
];

const USER_OPTIONS = [
  {
    label: "User",
    value: "user",
  },
];

const ORDER_OPTIONS = [
  {
    label: "Ascending",
    value: "asc",
  },
  {
    label: "Descending",
    value: "desc",
  },
];

const TRANSCRIPTION_FORMATS = [
  "json",
  "text",
  "srt",
  "verbose_json",
  "vtt",
];

const PURPOSES = [
  "fine-tune",
  "assistants",
  "vision",
  "batch",
];

const VOICES = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
];

const IMAGE_QUALITIES = [
  {
    label: "Standard",
    value: "standard",
  },
  {
    label: "HD",
    value: "hd",
  },
];

const IMAGE_STYLES = [
  {
    label: "Natural",
    value: "natural",
  },
  {
    label: "Vivid",
    value: "vivid",
  },
];

const IMAGE_SIZES = [
  "256x256",
  "512x512",
  "1024x1024",
  "1792x1024",
  "1024x1792",
];

const SUMMARIZE_LENGTH = [
  "word",
  "sentence",
  "paragraph",
  "page",
];

const TOOL_TYPES = [
  "code_interpreter",
  "file_search",
  "function",
];

const BATCH_ENDPOINTS = [
  "/v1/chat/completions",
  "/v1/embeddings",
  "/v1/completions",
];

export default {
  FINE_TUNING_MODEL_OPTIONS,
  TTS_MODELS,
  IMAGE_MODELS,
  MODERATION_MODELS,
  AUDIO_RESPONSE_FORMATS,
  CHAT_RESPONSE_FORMAT,
  IMAGE_RESPONSE_FORMATS,
  USER_OPTIONS,
  ORDER_OPTIONS,
  TRANSCRIPTION_FORMATS,
  PURPOSES,
  VOICES,
  IMAGE_QUALITIES,
  IMAGE_STYLES,
  IMAGE_SIZES,
  SUMMARIZE_LENGTH,
  TOOL_TYPES,
  BATCH_ENDPOINTS,
};

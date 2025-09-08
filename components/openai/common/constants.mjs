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

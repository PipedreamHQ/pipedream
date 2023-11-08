export default {
  IMAGE_SIZES: [
    "256x256",
    "512x512",
    "1024x1024",
  ],
  TRANSCRIPTION_FORMATS: [
    "json",
    "text",
    "srt",
    "verbose_json",
    "vtt",
  ],
  FINE_TUNING_MODEL_OPTIONS: [
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
  ],
};

const DEFAULT_LIMIT = 50;

// https://docs.fireflies.ai/schema/input/share-meeting-input
const MAX_SHARE_EMAILS = 50;
const SHARE_EXPIRY_DAYS_OPTIONS = [
  7,
  14,
  30,
];

// https://docs.fireflies.ai/schema/input/continue-askfred-thread-input
const MAX_QUESTION_LENGTH = 2000;

// https://docs.fireflies.ai/schema/input/update-meeting-title-input
const MIN_MEETING_TITLE_LENGTH = 5;
const MAX_MEETING_TITLE_LENGTH = 256;

// https://docs.fireflies.ai/schema/input/create-live-soundbite-input
const MIN_SOUNDBITE_PROMPT_LENGTH = 5;
const MAX_SOUNDBITE_PROMPT_LENGTH = 255;

// https://docs.fireflies.ai/graphql-api/mutation/create-bite
const MAX_BITE_NAME_LENGTH = 256;
const MAX_BITE_SUMMARY_LENGTH = 500;

// https://docs.fireflies.ai/schema/bite
const BITE_MEDIA_TYPE_OPTIONS = [
  "video",
  "audio",
];
const BITE_PRIVACY_OPTIONS = [
  "public",
  "team",
  "participants",
];

// https://docs.fireflies.ai/miscellaneous/language-codes
const RESPONSE_LANGUAGE_OPTIONS = [
  {
    label: "Arabic",
    value: "ar",
  },
  {
    label: "Bulgarian",
    value: "bg",
  },
  {
    label: "Chinese",
    value: "zh",
  },
  {
    label: "Croatian",
    value: "hr",
  },
  {
    label: "Czech",
    value: "cs",
  },
  {
    label: "Danish",
    value: "da",
  },
  {
    label: "Dutch",
    value: "nl",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label: "US English",
    value: "en-US",
  },
  {
    label: "Australia English",
    value: "en-AU",
  },
  {
    label: "UK English",
    value: "en-GB",
  },
  {
    label: "Finnish",
    value: "fi",
  },
  {
    label: "French",
    value: "fr",
  },
  {
    label: "German",
    value: "de",
  },
  {
    label: "Hebrew",
    value: "he",
  },
  {
    label: "Hindi",
    value: "hi",
  },
  {
    label: "Hungarian",
    value: "hu",
  },
  {
    label: "Indonesian",
    value: "id",
  },
  {
    label: "Italian",
    value: "it",
  },
  {
    label: "Japanese",
    value: "ja",
  },
  {
    label: "Korean",
    value: "ko",
  },
  {
    label: "Malay",
    value: "ms",
  },
  {
    label: "Norwegian",
    value: "no",
  },
  {
    label: "Polish",
    value: "pl",
  },
  {
    label: "Portuguese",
    value: "pt",
  },
  {
    label: "Romanian",
    value: "ro",
  },
  {
    label: "Russian",
    value: "ru",
  },
  {
    label: "Slovak",
    value: "sk",
  },
  {
    label: "Spanish",
    value: "es",
  },
  {
    label: "Latin American Spanish",
    value: "es-419",
  },
  {
    label: "Swedish",
    value: "sv",
  },
  {
    label: "Tamil",
    value: "ta",
  },
  {
    label: "Thai",
    value: "th",
  },
  {
    label: "Filipino",
    value: "tl",
  },
  {
    label: "Turkish",
    value: "tr",
  },
  {
    label: "Ukrainian",
    value: "uk",
  },
  {
    label: "Vietnamese",
    value: "vi",
  },
];

export default {
  DEFAULT_LIMIT,
  MAX_SHARE_EMAILS,
  SHARE_EXPIRY_DAYS_OPTIONS,
  MAX_QUESTION_LENGTH,
  MIN_MEETING_TITLE_LENGTH,
  MAX_MEETING_TITLE_LENGTH,
  MIN_SOUNDBITE_PROMPT_LENGTH,
  MAX_SOUNDBITE_PROMPT_LENGTH,
  MAX_BITE_NAME_LENGTH,
  MAX_BITE_SUMMARY_LENGTH,
  BITE_MEDIA_TYPE_OPTIONS,
  BITE_PRIVACY_OPTIONS,
  RESPONSE_LANGUAGE_OPTIONS,
};

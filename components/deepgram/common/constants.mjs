const DEFAULT_LIMIT = 50;

const TIER_OPTIONS = [
  {
    label: "These are our newest and most powerful speech-to-text models on the market today",
    value: "nova",
  },
  {
    label: "These are still some of our most powerful ASR models",
    value: "enhanced",
  },
  {
    label: "Applies our Base models, which are built on our signature end-to-end deep learning speech model architecture",
    value: "base",
  },
];

const MODEL_OPTIONS = [
  {
    label: "Optimized for everyday audio processing. TIERS: nova, enhanced, base",
    value: "general",
  },
  {
    label: "Optimized for conference room settings. TIERS: enhanced beta, base",
    value: "meeting",
  },
  {
    label: "Optimized for low-bandwidth audio phone calls. TIERS: nova, enhanced, base",
    value: "phonecall",
  },
  {
    label: "Optimized for low-bandwidth audio clips with a single speaker. TIERS: base",
    value: "voicemail",
  },
  {
    label: "Optimized for multiple speakers with varying audio quality. TIERS: enhanced, base",
    value: "finance",
  },
  {
    label: "Optimized to allow artificial intelligence technologies. TIERS: base",
    value: "conversationalai",
  },
  {
    label: "Optimized for audio sourced from videos. TIERS: base",
    value: "video",
  },
  {
    label: "Deepgram’s hosted version of OpenAI’s Whisper model. TIERS: not-applicable",
    value: "whisper",
  },
];

const REDACT_OPTIONS = [
  {
    label: "Redacts sensitive credit card information",
    value: "pci",
  },
  {
    label: "Aggressively redacts strings of numerals",
    value: "numbers",
  },
  {
    label: "Redacts social security numbers",
    value: "ssn",
  },
];

const LANGUAGES = [
  {
    value: "da",
    label: "Danish",
  },
  {
    value: "de",
    label: "German Germany",
  },
  {
    value: "en-AU",
    label: "English Australia",
  },
  {
    value: "en-IN",
    label: "English India",
  },
  {
    value: "en-NZ",
    label: "English New Zealand",
  },
  {
    value: "en-GB",
    label: "English United Kingdom",
  },
  {
    value: "en-US",
    label: "English United States",
  },
  {
    value: "es",
    label: "Spanish Spain",
  },
  {
    value: "es-419",
    label: "Spanish Latin America",
  },
  {
    value: "fr-CA",
    label: "French Canada",
  },
  {
    value: "fr",
    label: "French France",
  },
  {
    value: "hi",
    label: "Hindi India",
  },
  {
    value: "hi-Latn",
    label: "Hindi Roman Script",
  },
  {
    value: "id",
    label: "Indonesian Indonesia",
  },
  {
    value: "it",
    label: "Italian Italy",
  },
  {
    value: "ja",
    label: "Japanese Japan",
  },
  {
    value: "ko",
    label: "Korean Republic of Korea",
  },
  {
    value: "nl",
    label: "Dutch",
  },
  {
    value: "no",
    label: "Norwegian Norway",
  },
  {
    value: "pl",
    label: "Polish Poland",
  },
  {
    value: "pt-BR",
    label: "Portuguese Brazil",
  },
  {
    value: "pt-PT",
    label: "Portuguese Portugal",
  },
  {
    value: "ru",
    label: "Russian Russian Federation",
  },
  {
    value: "sv",
    label: "Swedish Sweden",
  },
  {
    value: "tr",
    label: "Turkish Turkey",
  },
  {
    value: "zh-CN",
    label: "Chinese China",
  },
  {
    value: "zh-TW",
    label: "Chinese Taiwan",
  },
  {
    value: "uk",
    label: "Ukranian",
  },
];

export default {
  DEFAULT_LIMIT,
  TIER_OPTIONS,
  MODEL_OPTIONS,
  REDACT_OPTIONS,
  LANGUAGES,
};

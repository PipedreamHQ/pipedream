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

export default {
  DEFAULT_LIMIT,
  TIER_OPTIONS,
  MODEL_OPTIONS,
  REDACT_OPTIONS,
};

export const PLATFORMS = [
  {
    label: "LinkedIn",
    value: "linkedin",
  },
  {
    label: "Instagram",
    value: "instagram",
  },
  {
    label: "Threads",
    value: "threads",
  },
  {
    label: "TikTok",
    value: "tiktok",
  },
  {
    label: "X (Twitter)",
    value: "x",
  },
];

export const MEDIA_TYPES = [
  {
    label: "Auto-detect",
    value: "auto",
  },
  {
    label: "Image",
    value: "image",
  },
  {
    label: "Video",
    value: "video",
  },
];

export const PLATFORM_FILTER_OPTIONS = [
  {
    label: "All Platforms",
    value: "",
  },
  ...PLATFORMS,
];

export const SIGNATURE_TOLERANCE_SECONDS = 300;

export const DEFAULT_TIMEOUT_MS = 30000;

const PLATFORMS = [
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

const MEDIA_TYPES = [
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

const PLATFORM_FILTER_OPTIONS = [
  {
    label: "All Platforms",
    value: "",
  },
  ...PLATFORMS,
];

export default {
  PLATFORMS,
  MEDIA_TYPES,
  PLATFORM_FILTER_OPTIONS,
};

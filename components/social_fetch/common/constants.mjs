export const HANDLE_PLATFORMS = [
  "tiktok",
  "instagram",
  "twitter",
  "threads",
];

export const URL_PROFILE_PLATFORMS = [
  "facebook",
  "linkedin",
];

export const PROFILE_PLATFORMS = [
  ...URL_PROFILE_PLATFORMS,
  ...HANDLE_PLATFORMS,
];

export const POST_PLATFORMS = [
  "tiktok",
  "instagram",
  "twitter",
  "threads",
  "facebook",
  "youtube",
  "linkedin",
];

export const LIST_PROFILE_POSTS_PLATFORMS = [
  "tiktok",
  "instagram",
  "twitter",
  "threads",
  "facebook",
];

export const TRANSCRIPT_PLATFORMS = [
  "tiktok",
  "instagram",
  "facebook",
  "youtube",
];

export const CONTENT_TYPE_OPTIONS = [
  {
    label: "Videos",
    value: "videos",
  },
  {
    label: "Posts",
    value: "posts",
  },
  {
    label: "Reels",
    value: "reels",
  },
  {
    label: "Tweets",
    value: "tweets",
  },
];

export const API_BASE_URL = "https://api.socialfetch.dev";

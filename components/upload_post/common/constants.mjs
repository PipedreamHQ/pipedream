const BASE_URL = "https://api.upload-post.com/api";

const PLATFORM_LABELS = {
  bluesky: "Bluesky",
  devto: "DEV Community",
  discord: "Discord",
  facebook: "Facebook",
  google_business: "Google Business Profile",
  hashnode: "Hashnode",
  instagram: "Instagram",
  lemmy: "Lemmy",
  linkedin: "LinkedIn",
  listmonk: "Listmonk",
  mastodon: "Mastodon",
  nostr: "Nostr",
  pinterest: "Pinterest",
  slack: "Slack",
  telegram: "Telegram",
  threads: "Threads",
  tiktok: "TikTok",
  whop: "Whop",
  wordpress: "WordPress",
  x: "X (Twitter)",
  youtube: "YouTube",
};

// Supported values of `platform[]` for each endpoint, as documented at
// https://docs.upload-post.com/api/upload-video, /api/upload-photo and /api/upload-text
const VIDEO_PLATFORMS = [
  "tiktok",
  "instagram",
  "youtube",
  "linkedin",
  "facebook",
  "x",
  "threads",
  "pinterest",
  "bluesky",
  "discord",
  "telegram",
  "google_business",
  "mastodon",
  "wordpress",
];

const PHOTO_PLATFORMS = [
  "tiktok",
  "instagram",
  "linkedin",
  "facebook",
  "x",
  "threads",
  "pinterest",
  "bluesky",
  "discord",
  "telegram",
  "google_business",
  "mastodon",
  "lemmy",
  "wordpress",
];

const TEXT_PLATFORMS = [
  "linkedin",
  "x",
  "facebook",
  "threads",
  "bluesky",
  "discord",
  "telegram",
  "google_business",
  "slack",
  "mastodon",
  "nostr",
  "lemmy",
  "devto",
  "hashnode",
  "wordpress",
  "whop",
  "listmonk",
];

// https://docs.upload-post.com/api/get-analytics
const ANALYTICS_PLATFORMS = [
  "instagram",
  "tiktok",
  "linkedin",
  "facebook",
  "x",
  "youtube",
  "threads",
  "pinterest",
  "bluesky",
  "google_business",
];

const HISTORY_PLATFORMS = [
  "tiktok",
  "instagram",
  "youtube",
  "facebook",
  "linkedin",
  "x",
  "threads",
  "pinterest",
  "bluesky",
  "google_business",
  "discord",
  "telegram",
];

const TIKTOK_PRIVACY_LEVELS = [
  "PUBLIC_TO_EVERYONE",
  "MUTUAL_FOLLOW_FRIENDS",
  "FOLLOWER_OF_CREATOR",
  "SELF_ONLY",
];

const LINKEDIN_VISIBILITY = [
  "PUBLIC",
  "CONNECTIONS",
  "LOGGED_IN",
  "CONTAINER",
];

const YOUTUBE_PRIVACY_STATUS = [
  "public",
  "unlisted",
  "private",
];

const HISTORY_PAGE_SIZES = [
  10,
  20,
  50,
  100,
];

export default {
  BASE_URL,
  PLATFORM_LABELS,
  VIDEO_PLATFORMS,
  PHOTO_PLATFORMS,
  TEXT_PLATFORMS,
  ANALYTICS_PLATFORMS,
  HISTORY_PLATFORMS,
  TIKTOK_PRIVACY_LEVELS,
  LINKEDIN_VISIBILITY,
  YOUTUBE_PRIVACY_STATUS,
  HISTORY_PAGE_SIZES,
};

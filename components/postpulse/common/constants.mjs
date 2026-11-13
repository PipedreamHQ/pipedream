// Platforms whose posts go to a destination picked from the account's chats:
// a Facebook Page, a Telegram channel or chat, or a Pinterest board.
const CHAT_PLATFORMS = [
  "FACEBOOK",
  "TELEGRAM",
  "PINTEREST",
];

// The account platform (GET /v1/accounts) differs from the post settings type for two platforms.
const SETTINGS_TYPE_BY_PLATFORM = {
  TIKTOK: "TIK_TOK",
  X_TWITTER: "TWITTER",
};

const PUBLICATION_TYPES = [
  "FEED",
  "REELS",
  "STORY",
];

const TIKTOK_PRIVACY_LEVELS = [
  {
    label: "Everyone",
    value: "PUBLIC_TO_EVERYONE",
  },
  {
    label: "Followers",
    value: "FOLLOWER_OF_CREATOR",
  },
  {
    label: "Friends (Mutual Followers)",
    value: "MUTUAL_FOLLOW_FRIENDS",
  },
  {
    label: "Only me",
    value: "SELF_ONLY",
  },
];

const MEDIA_IMPORT_POLL_INTERVAL_MS = 2000;
const MEDIA_IMPORT_MAX_ATTEMPTS = 60;

export default {
  CHAT_PLATFORMS,
  SETTINGS_TYPE_BY_PLATFORM,
  PUBLICATION_TYPES,
  TIKTOK_PRIVACY_LEVELS,
  MEDIA_IMPORT_POLL_INTERVAL_MS,
  MEDIA_IMPORT_MAX_ATTEMPTS,
};

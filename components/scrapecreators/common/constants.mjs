export const PATH_PLATFORMS = {
  "channel": [
    "youtube",
  ],
  "user/boards": [
    "pinterest",
  ],
  "empty": [
    "linktree",
    "komi",
    "pillar",
    "linkbio",
  ],
};

export const URL_PLATFORMS = [
  "linkedin",
  "facebook",
  ...PATH_PLATFORMS["empty"],
];

export const SEARCH_PLATFORMS = [
  "tiktok",
  "threads",
];

export const HANDLE_PLATFORMS = [
  "instagram",
  "twitter",
  "truthsocial",
  "bluesky",
  "twitch",
  "snapchat",
  ...SEARCH_PLATFORMS,
  ...PATH_PLATFORMS["user/boards"],
  ...PATH_PLATFORMS["channel"],
];

export const PLATFORMS = [
  ...URL_PLATFORMS,
  ...HANDLE_PLATFORMS,
];

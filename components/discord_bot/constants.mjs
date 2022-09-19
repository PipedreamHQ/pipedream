const LAST_MESSAGE_IDS = "lastMessageIDs";
const GUILD_MEMBER_IDS = "guildMemberIDs";
const DEFAULT_MAX_ITEMS = 60;
const DEFAULT_PAGE_LIMIT = 20;
const PAGINATION_KEY = {
  BEFORE: "before",
  AFTER: "after",
};
const HEADER_RETRY_AFTER = "retry-after";
const DEFAULT_NUMBER_OF_RETRIES = 3;
const DEFAULT_RETRY_AFTER_MS = 500;

/**
 * See the docs about the `type` FIELD [here](https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure)
 */
const PERMISSION_TYPES = {
  ROLE: 0,
  MEMBER: 1,
};

/**
 * See the docs here for more [info](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
 */
const CHANNEL_TYPES = {
  GUILD_TEXT:	0,
  DM: 1,
  GUILD_VOICE: 2,
  GROUP_DM: 3,
  GUILD_CATEGORY: 4,
  GUILD_NEWS: 5,
  GUILD_STORE: 6,
  GUILD_NEWS_THREAD: 10,
  GUILD_PUBLIC_THREAD: 11,
  GUILD_PRIVATE_THREAD: 12,
  GUILD_STAGE_VOICE: 13,
};

/**
 * See the docs here for more [info](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes)
 */
const VIDEO_QUALITY_MODES = {
  AUTO: 1,
  FULL: 2,
};

/**
 * See the docs here for more [info](https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types)
 */
const INVITE_TARGET_TYPES = {
  STREAM: 1,
  EMBEDDED_APPLICATION: 2,
};

/**
 * Don't display some of the channels according to the docs
 * [here](https://discord.com/developers/docs/resources/channel#channel-object-channel-types).
 * For future reference take a look at [this](https://discord.com/developers/docs/reference#api-versioning).
 */
const NOT_ALLOWED_CHANNELS = [
  CHANNEL_TYPES.GUILD_NEWS_THREAD,
  CHANNEL_TYPES.GUILD_PUBLIC_THREAD,
  CHANNEL_TYPES.GUILD_PRIVATE_THREAD,
];

export default {
  LAST_MESSAGE_IDS,
  GUILD_MEMBER_IDS,
  PERMISSION_TYPES,
  CHANNEL_TYPES,
  NOT_ALLOWED_CHANNELS,
  VIDEO_QUALITY_MODES,
  INVITE_TARGET_TYPES,
  DEFAULT_MAX_ITEMS,
  DEFAULT_PAGE_LIMIT,
  PAGINATION_KEY,
  DEFAULT_NUMBER_OF_RETRIES,
  HEADER_RETRY_AFTER,
  DEFAULT_RETRY_AFTER_MS,
};

const MAX_RESOURCES = 800;
const LIMIT = 250;
// Caps `users.list` pagination in name lookups, since unresolvable ids (e.g.
// external Slack Connect users) would otherwise force a full directory scan
// and exhaust the method's rate limit.
const MAX_NAME_LOOKUP_PAGES = 5;
// Caps `conversations.list` pagination when resolving a channel NAME to an id
// (at 999/page, 5 pages covers ~5000 channels). Without a cap, a channel name
// that doesn't exist (typo, wrong workspace) forces a full workspace scan —
// on a large workspace that alone can exhaust conversations.list's rate limit.
const MAX_CHANNEL_RESOLVE_PAGES = 5;
// User-token errors on which file reads retry with the bot token.
const FILES_READ_BOT_FALLBACK_ERRORS = [
  "missing_scope",
  "file_not_found",
  "channel_not_found",
  "not_in_channel",
];
// Pipedream's /tmp limit: https://pipedream.com/docs/workflows/limits#disk
const MAX_DOWNLOAD_SIZE_BYTES = 2 * 1024 * 1024 * 1024;
const STREAM_RESPONSE_TYPE = "stream";
const CANVAS_FILETYPE = "quip";

const CHANNEL_TYPE = {
  PUBLIC: "public_channel",
  PRIVATE: "private_channel",
  MPIM: "mpim",
  IM: "im",
};

const CHANNEL_TYPE_OPTIONS = [
  {
    label: "Channels",
    value: "Channels",
  },
  {
    label: "Group",
    value: CHANNEL_TYPE.MPIM,
  },
  {
    label: "User / Direct Message",
    value: CHANNEL_TYPE.IM,
  },
];

// Block Kit block-type literals used by build-blocks createBlock() branching.
const BLOCK_TYPES = {
  SECTION: "section",
  CONTEXT: "context",
  LINK_BUTTON: "link_button",
};

// Option values for the passArrayOrConfigure prop shared by build-blocks and
// the concrete actions that spread it (send-block-kit-message, send-message-advanced).
const PASS_ARRAY_OR_CONFIGURE_OPTIONS = {
  ARRAY: "array",
  CONFIGURE: "configure",
};

export default {
  MAX_RESOURCES,
  LIMIT,
  MAX_NAME_LOOKUP_PAGES,
  MAX_CHANNEL_RESOLVE_PAGES,
  FILES_READ_BOT_FALLBACK_ERRORS,
  MAX_DOWNLOAD_SIZE_BYTES,
  STREAM_RESPONSE_TYPE,
  CANVAS_FILETYPE,
  CHANNEL_TYPE,
  CHANNEL_TYPE_OPTIONS,
  BLOCK_TYPES,
  PASS_ARRAY_OR_CONFIGURE_OPTIONS,
};

const BASE_URL = "https://bsky.social";
const VERSION_PATH = "/xrpc";

const INTERACTION_EVENT = {
  REQUEST_LESS: "app.bsky.feed.defs#requestLess",
  REQUEST_MORE: "app.bsky.feed.defs#requestMore",
  CLICK_THROUGH_ITEM: "app.bsky.feed.defs#clickthroughItem",
  CLICK_THROUGH_AUTHOR: "app.bsky.feed.defs#clickthroughAuthor",
  CLICK_THROUGH_REPOSTER: "app.bsky.feed.defs#clickthroughReposter",
  CLICK_THROUGH_EMBED: "app.bsky.feed.defs#clickthroughEmbed",
  INTERACTION_SEEN: "app.bsky.feed.defs#interactionSeen",
  INTERACTION_LIKE: "app.bsky.feed.defs#interactionLike",
  INTERACTION_REPOST: "app.bsky.feed.defs#interactionRepost",
  INTERACTION_REPLY: "app.bsky.feed.defs#interactionReply",
  INTERACTION_QUOTE: "app.bsky.feed.defs#interactionQuote",
  INTERACTION_SHARE: "app.bsky.feed.defs#interactionShare",
};

const RESOURCE_TYPE = {
  POST: "app.bsky.feed.post",
  LIKE: "app.bsky.feed.like",
};

const HANDLE_AND_POST_ID_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:[^/]+)\/profile\/(?<handle>[^/]+)\/post\/(?<postId>[^/]+)/;

const DEFAULT_LIMIT = 3;
const DEFAULT_MAX = 600;
const IS_FIRST_RUN = "isFirstRun";
const LAST_DATE_AT = "lastDateAt";

export default {
  BASE_URL,
  VERSION_PATH,
  INTERACTION_EVENT,
  RESOURCE_TYPE,
  HANDLE_AND_POST_ID_REGEX,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  IS_FIRST_RUN,
  LAST_DATE_AT,
};

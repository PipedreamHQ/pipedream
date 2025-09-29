import constants from "@pipedream/slack/common/constants.mjs";

const LAST_TIMESTAMP = "lastTimestamp";

const RESOURCE_NAME = {
  MESSAGES: "messages",
};

const REQUIRED_SOURCE_SCOPES = [
  "users:read",
  "channels:read",
  "groups:read",
  "mpim:read",
  "im:read",
  "channels:history",
  "groups:history",
  "mpim:history",
  "im:history",
];

export default {
  ...constants,
  LAST_TIMESTAMP,
  RESOURCE_NAME,
  REQUIRED_SOURCE_SCOPES,
};

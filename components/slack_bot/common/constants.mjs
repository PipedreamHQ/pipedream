import constants from "../../slack/common/constants.mjs";

const LAST_TIMESTAMP = "lastTimestamp";
const LAST_CURSOR = "lastCursor";

const RESOURCE_NAME = {
  MESSAGES: "messages",
  ITEMS: "items",
};

export default {
  ...constants,
  LAST_TIMESTAMP,
  LAST_CURSOR,
  RESOURCE_NAME,
};

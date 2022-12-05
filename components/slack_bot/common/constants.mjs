import constants from "../../slack/common/constants.mjs";

const LAST_TIMESTAMP = "lastTimestamp";

const CHANNEL_TYPE = {
  PUBLIC: "public_channel",
  PRIVATE: "private_channel",
  MPIM: "mpim",
  IM: "im",
};

const RESOURCE_NAME = {
  MESSAGES: "messages",
};

export default {
  ...constants,
  LAST_TIMESTAMP,
  CHANNEL_TYPE,
  RESOURCE_NAME,
};

const events = {
  im: "User",
  message: "Message",
  file: "File",
  channel: "Channel",
};

const eventsOptions = [
  {
    label: "User",
    value: "im",
  },
  {
    label: "Message",
    value: "message",
  },
  {
    label: "File",
    value: "file",
  },
  {
    label: "Channel",
    value: "channel",
  },
];

const SUBTYPE = {
  NULL: null,
  BOT_MESSAGE: "bot_message",
  FILE_SHARE: "file_share",
  PD_HISTORY_MESSAGE: "pd_history_message",
  MESSAGE_REPLIED: "message_replied",
};

const ALLOWED_SUBTYPES = [
  SUBTYPE.NULL,
  SUBTYPE.BOT_MESSAGE,
  SUBTYPE.FILE_SHARE,
  SUBTYPE.PD_HISTORY_MESSAGE,
];

const ALLOWED_MESSAGE_IN_CHANNEL_SUBTYPES = [
  SUBTYPE.NULL,
  SUBTYPE.BOT_MESSAGE,
  SUBTYPE.FILE_SHARE,
  SUBTYPE.MESSAGE_REPLIED,
];

export const NAME_CACHE_MAX_SIZE = 1000;
export const NAME_CACHE_TIMEOUT = 3600000;

export default {
  events,
  eventsOptions,
  SUBTYPE,
  ALLOWED_SUBTYPES,
  ALLOWED_MESSAGE_IN_CHANNEL_SUBTYPES,
};

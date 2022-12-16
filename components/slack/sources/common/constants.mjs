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
};

const ALLOWED_SUBTYPES = Object.values(SUBTYPE);

export default {
  events,
  eventsOptions,
  SUBTYPE,
  ALLOWED_SUBTYPES,
};

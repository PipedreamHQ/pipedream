const MAX_RESOURCES = 6000;
const DEFAULT_LIMIT = 20;

const LAST_END_TIME = "lastEndTime";
const LAST_MESSAGE_TIME = "lastMessageTime";
const APP_ID = "appId";
const MESSAGE_UUID = "messageUuid";

const DEFAULT_ANSWER_URL = "https://s3.amazonaws.com/static.plivo.com/answer.xml";

const RESOURCE = {
  MSG: {
    TYPE: {
      SMS: "sms",
      MMS: "mms",
    },
    STATUS: {
      DELIVERED: "delivered",
    },
    DIRECTION: {
      INBOUND: "inbound",
      OUTBOUND: "outbound",
    },
  },
};

export default {
  DEFAULT_LIMIT,
  MAX_RESOURCES,
  LAST_END_TIME,
  LAST_MESSAGE_TIME,
  APP_ID,
  MESSAGE_UUID,
  RESOURCE,
  DEFAULT_ANSWER_URL,
};

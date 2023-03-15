const BASE_URL = "https://portal.bulkgate.com";
const VERSION_PATH = {
  V1: "/api/1.0",
  V2: "/api/2.0",
};

const SENDER_ID = {
  GSYSTEM: {
    label: "System Number",
    value: "gSystem",
  },
  GSHORT: {
    label: "Short Code",
    value: "gShort",
  },
  GTEXT: {
    label: "Text sender",
    value: "gText",
  },
  GMOBILE: {
    label: "Mobile Connect",
    value: "gMobile",
  },
  GPUSH: {
    label: "Mobile Connect push - Sends a notification to the Mobile Connect app",
    value: "gPush",
  },
  GOWN: {
    label: "Own Number (number verification required)",
    value: "gOwn",
  },
  GPROFILE: {
    label: "BulkGate Profile ID",
    value: "gProfile",
  },
  INT: {
    label: "BulkGate Profile ID",
    value: "<int>",
  },
};

export default {
  BASE_URL,
  VERSION_PATH,
  SENDER_ID,
};

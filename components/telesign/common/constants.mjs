const BASE_URL = "https://rest-ww.telesign.com";
const VERSION_PATH = {
  V1: "/v1",
};

const MESSAGE_TYPES = [
  {
    label: "ARN - Alerts, Reminders, and Notifications",
    value: "ARN",
  },
  {
    label: "MKT - Marketing",
    value: "MKT",
  },
  {
    label: "OTP - One Time Passwords",
    value: "OTP",
  },
];

export default {
  BASE_URL,
  VERSION_PATH,
  MESSAGE_TYPES,
};

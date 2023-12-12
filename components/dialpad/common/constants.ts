export default {
  HTTP_PROTOCOL: "https://",
  BASE_URL: "dialpad.com",
  VERSION_PATH: "/api/v2",
  EVENT_TYPE: {
    NEW_CALL: {
      name: "NEW_CALL",
      path: "/subscriptions/call",
    },
    NEW_SMS: {
      name: "NEW_SMS",
      path: "/subscriptions/sms",
    },
    UPDATE_CONTACT: {
      name: "UPDATE_CONTACT",
      path: "/subscriptions/contact",
    },
  },
  SMS_EVENT_DIRECTIONS: [
    "inbound",
    "outbound",
    "all",
  ],
  CONTACT_EVENT_TYPE: [
    "shared",
  ],
  CALL_STATES: [
    "calling",
    "hangup",
  ],
  PAGE_SIZE: 100,
  retriableStatusCodes: [
    408,
    429,
    500,
  ],
};

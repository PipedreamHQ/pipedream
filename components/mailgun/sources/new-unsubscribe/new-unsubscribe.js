const {
  methods,
  ...common
} = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailgun-new-unsubscribe",
  name: "New Unsubscribe",
  type: "source",
  description: "Emit new event when the email recipient clicked on the unsubscribe link. " +
    "Unsubscribe tracking must be enabled in the Mailgun control panel. See more at the " +
    "Mailgun User's Manual [Tracking Messages]" +
    "(https://documentation.mailgun.com/en/latest/user_manual.html#tracking-messages) section",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...methods,
    getEventName() {
      return [
        "unsubscribed",
      ];
    },
    getEventType() {
      return [
        "UNSUBSCRIBED",
        "unsubscribed",
      ];
    },
    generateMeta(payload) {
      const id = payload.message.headers["message-id"];
      return {
        id: `${payload.id}${payload.timestamp}`,
        summary: `New Unsubscribe on ${id} by ${payload.recipient}`,
        ts: payload.timestamp,
      };
    },
  },
};

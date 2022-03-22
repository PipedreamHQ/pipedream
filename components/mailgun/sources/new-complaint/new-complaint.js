const {
  methods,
  ...common
} = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailgun-new-complaint",
  name: "New Complaint",
  type: "source",
  description: "Emit new event when the email recipient clicked on the spam complaint button " +
    "within their email client. Feedback loops enable the notification to be received by Mailgun.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...methods,
    getEventName() {
      return [
        "complained",
      ];
    },
    getEventType() {
      return [
        "complained",
      ];
    },
    generateMeta(payload) {
      const id = payload.message.headers["message-id"];
      return {
        id: `${payload.id}${payload.timestamp}`,
        summary: `New Complaint on message ${id} by ${payload.recipient}`,
        ts: payload.timestamp,
      };
    },
  },
};

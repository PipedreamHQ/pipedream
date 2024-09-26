import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailgun-new-unsubscribe",
  name: "New Unsubscribe (Instant)",
  type: "source",
  description: "Emit new event when the email recipient clicked on the unsubscribe link. " +
    "Unsubscribe tracking must be enabled in the Mailgun control panel. See more at the " +
    "Mailgun User's Manual [Tracking Messages]" +
    "(https://documentation.mailgun.com/en/latest/user_manual.html#tracking-messages) section",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
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

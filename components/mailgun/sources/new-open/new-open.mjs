import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailgun-new-open",
  name: "New Open (Instant)",
  type: "source",
  description: "Emit new event when the email recipient opened the email and enabled image " +
    "viewing. Open tracking must be enabled in the Mailgun control panel, and the CNAME record " +
    "must be pointing to mailgun.org. See more at the Mailgun User's Manual [Tracking Messages]" +
    "(https://documentation.mailgun.com/en/latest/user_manual.html#tracking-messages) section",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return [
        "opened",
      ];
    },
    getEventType() {
      return [
        "OPENED",
        "opened",
      ];
    },
    generateMeta(payload) {
      const id = payload.message.headers["message-id"];
      return {
        id: `${payload.id}${payload.timestamp}`,
        summary: `New Open on message ${id} by ${payload.recipient}`,
        ts: payload.timestamp,
      };
    },
  },
};

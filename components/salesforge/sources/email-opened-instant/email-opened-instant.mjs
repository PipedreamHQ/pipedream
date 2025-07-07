import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-email-opened-instant",
  name: "Email Opened (Instant)",
  description: "Emit new event when an email is opened in Salesforge. [See the documentation](https://api.salesforge.ai/public/v2/swagger/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_opened";
    },
    getSummary(data) {
      return `Email opened: ${data.name || data.id}`;
    },
  },
};

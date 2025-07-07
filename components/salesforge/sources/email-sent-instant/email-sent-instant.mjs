import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-email-sent-instant",
  name: "Email Sent (Instant)",
  description: "Emit new event when an email is sent in Salesforge. [See the documentation](https://api.salesforge.ai/public/v2/swagger/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_sent";
    },
    getSummary(data) {
      return `Email sent: ${data.name || data.id}`;
    },
  },
};

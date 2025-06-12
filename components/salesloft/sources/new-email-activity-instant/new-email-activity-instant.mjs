import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesloft-new-email-activity-instant",
  name: "New Email Activity (Instant)",
  description: "Emit new event when an email is updated in Salesloft. [See the documentation](https://developers.salesloft.com/docs/api/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_updated";
    },
    getSummary(data) {
      return `Email updated: ${data.subject || data.id}`;
    },
  },
};

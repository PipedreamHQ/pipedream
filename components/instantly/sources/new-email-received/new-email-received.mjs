import common from "../common/base.mjs";

export default {
  ...common,
  key: "instantly-new-email-received",
  name: "New Email Received",
  description: "Emit new event when a new email is received. [See the documentation](https://developer.instantly.ai/api/v2/email/listemail)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.instantly.listEmails;
    },
    getArgs() {
      return {
        params: {
          email_type: "received",
          sort_order: "desc",
        },
      };
    },
    getTsField() {
      return "timestamp_created";
    },
    getSummary(item) {
      return `New Email with ID: ${item.id}`;
    },
  },
};

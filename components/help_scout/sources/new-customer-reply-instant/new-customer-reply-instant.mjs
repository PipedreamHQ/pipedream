import common from "../common/base.mjs";

export default {
  ...common,
  key: "help_scout-new-customer-reply-instant",
  name: "New Customer Reply (Instant)",
  description: "Emit new event when a customer replies to a conversation.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "convo.customer.reply.created",
      ];
    },
    getSummary(body) {
      return `New customer reply from ${body.primaryCustomer?.email} in conversation: ${body.subject}`;
    },
  },
};

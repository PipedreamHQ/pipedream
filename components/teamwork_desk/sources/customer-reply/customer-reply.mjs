import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Customer Reply",
  key: "teamwork_desk-customer-reply",
  type: "source",
  description: "Emit new event when a customer reply.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "ticket.customer.reply",
      ];
    },
    getMetadata({
      thread: {
        id, createdAt,
      },
    }) {
      return {
        id: id,
        summary: `A new customer reply with id ${id} was successfully created!`,
        ts: createdAt,
      };
    },
  },
};

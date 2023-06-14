import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Customer Created",
  key: "teamwork_desk-customer-created",
  type: "source",
  description: "Emit new event when a new customer is created.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "customer.created",
      ];
    },
    getMetadata({
      customer: {
        id, createdAt,
      },
    }) {
      return {
        id: id,
        summary: `A new customer with id ${id} was successfully created!`,
        ts: createdAt,
      };
    },
  },
};

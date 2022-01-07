import common from "../common/common-ticket.mjs";

export default {
  ...common,
  name: "New Ticket",
  key: "zendesk-create-ticket",
  type: "source",
  description: "Emit new event when a ticket is created",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Create Ticket Webhook";
    },
    getTriggerTitle() {
      return "Create Ticket Trigger";
    },
    getTriggerConditions() {
      return {
        all: [
          {
            field: "update_type",
            value: "Create",
          },
        ],
      };
    },
  },
};

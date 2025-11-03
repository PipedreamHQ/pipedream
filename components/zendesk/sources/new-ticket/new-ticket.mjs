import common from "../common/ticket.mjs";

export default {
  ...common,
  name: "New Ticket (Instant)",
  key: "zendesk-new-ticket",
  type: "source",
  description: "Emit new event when a ticket is created",
  version: "0.2.8",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "New Ticket Webhook";
    },
    getTriggerTitle() {
      return "New Ticket Trigger";
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

import common from "../common/ticket.mjs";

export default {
  ...common,
  name: "Ticket Updated (Instant)",
  key: "zendesk-ticket-updated",
  type: "source",
  description: "Emit new event when a ticket has been updated",
  version: "0.2.8",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Ticket Updated Webhook";
    },
    getTriggerTitle() {
      return "Ticket Updated Trigger";
    },
    getTriggerConditions() {
      return {
        all: [
          {
            field: "update_type",
            value: "Change",
          },
        ],
      };
    },
  },
};

import common from "../common/ticket.mjs";

export default {
  ...common,
  name: "Ticket Pended (Instant)",
  key: "zendesk-ticket-pended",
  type: "source",
  description: "Emit new event when a ticket has changed to pending status",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Ticket Pended Webhook";
    },
    getTriggerTitle() {
      return "Ticket Pended Trigger";
    },
    getTriggerConditions() {
      return {
        all: [
          {
            field: "update_type",
            value: "Change",
          },
          {
            field: "status",
            operator: "value",
            value: "pending",
          },
        ],
      };
    },
  },
};

import common from "../common/ticket.mjs";

export default {
  ...common,
  name: "Ticket Closed (Instant)",
  key: "zendesk-ticket-closed",
  type: "source",
  description: "Emit new event when a ticket has changed to closed status",
  version: "0.2.10",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Ticket Closed Webhook";
    },
    getTriggerTitle() {
      return "Ticket Closed Trigger";
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
            value: "closed",
          },
        ],
      };
    },
  },
};

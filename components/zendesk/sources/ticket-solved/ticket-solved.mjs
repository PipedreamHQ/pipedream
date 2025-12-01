import common from "../common/ticket.mjs";

export default {
  ...common,
  name: "Ticket Solved (Instant)",
  key: "zendesk-ticket-solved",
  type: "source",
  description: "Emit new event when a ticket has changed to solved status",
  version: "0.2.10",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Ticket Solved Webhook";
    },
    getTriggerTitle() {
      return "Ticket Solved Trigger";
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
            value: "solved",
          },
        ],
      };
    },
  },
};

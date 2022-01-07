import common from "../common/common-ticket.mjs";

export default {
  ...common,
  name: "Changed to Solved Ticket",
  key: "zendesk-changed-to-solved-ticket",
  type: "source",
  description: "Emit new event when a ticket has changed to solved status",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Changed to Solved Ticket Webhook";
    },
    getTriggerTitle() {
      return "Changed to Solved Ticket Trigger";
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

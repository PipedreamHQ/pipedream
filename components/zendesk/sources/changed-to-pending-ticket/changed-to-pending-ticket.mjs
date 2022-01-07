import common from "../common/common-ticket.mjs";

export default {
  ...common,
  name: "Changed to Pending Ticket",
  key: "zendesk-changed-to-pending-ticket",
  type: "source",
  description: "Emit new event when a ticket has changed to pending status",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Changed to Pending Ticket Webhook";
    },
    getTriggerTitle() {
      return "Changed to Pending Ticket Trigger";
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

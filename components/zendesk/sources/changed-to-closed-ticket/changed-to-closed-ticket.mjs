import common from "../common/common-ticket.mjs";

export default {
  ...common,
  name: "Changed to Closed Ticket",
  key: "zendesk-changed-to-closed-ticket",
  type: "source",
  description: "Emit new event when a ticket has changed to closed status",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Changed to Closed Ticket Webhook";
    },
    getTriggerTitle() {
      return "Changed to Closed Ticket Trigger";
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

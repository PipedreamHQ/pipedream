import common from "../common/ticket.mjs";

export default {
  ...common,
  key: "zendesk-ticket-added-to-view",
  name: "New Ticket Added to View (Instant)",
  description: "Emit new event when a ticket is added to the specified view",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    viewId: {
      propDefinition: [
        common.props.app,
        "viewId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Ticket Added To View Webhook";
    },
    getTriggerTitle() {
      return "Ticket Added To View Trigger";
    },
    getTriggerConditions() {
      return {
        any: [
          {
            field: "update_type",
            value: "Change",
          },
          {
            field: "update_type",
            value: "Create",
          },
        ],
      };
    },
    async isRelevant(payload) {
      const { tickets } = await this.app.listTicketsInView({
        viewId: this.viewId,
      });
      const foundTicket = tickets.find(({ id }) => id == payload.ticketId);
      return foundTicket;
    },
  },
};

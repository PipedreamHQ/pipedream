import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Ticket Created",
  key: "teamwork_desk-ticket-created",
  type: "source",
  description: "Emit new event when a new ticket is created.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "ticket.created",
      ];
    },
    getMetadata({
      ticket: {
        id, createdAt,
      },
    }) {
      return {
        id: id,
        summary: `A new ticket with id ${id} was successfully created!`,
        ts: createdAt,
      };
    },
  },
};

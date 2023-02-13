import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-delete-ticket",
  name: "Delete Ticket",
  description: "Deletes a ticket. [See the docs](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#delete-ticket).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
  },
  methods: {
    deleteTicket({
      ticketId, ...args
    } = {}) {
      return this.app.delete({
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    await this.deleteTicket({
      step,
      ticketId: this.ticketId,
    });

    step.export("$summary", "Successfully deleted ticket");

    return true;
  },
};

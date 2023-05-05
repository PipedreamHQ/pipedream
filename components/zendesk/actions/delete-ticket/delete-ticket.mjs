import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-delete-ticket",
  name: "Delete Ticket",
  description: "Deletes a ticket. [See the docs](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#delete-ticket).",
  type: "action",
  version: "0.1.0",
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
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
    const {
      ticketId,
      customSubdomain,
    } = this;

    await this.deleteTicket({
      step,
      ticketId,
      customSubdomain,
    });

    step.export("$summary", "Successfully deleted ticket");

    return true;
  },
};

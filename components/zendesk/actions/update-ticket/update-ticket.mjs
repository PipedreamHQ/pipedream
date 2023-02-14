import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-update-ticket",
  name: "Update Ticket",
  description: "Updates a ticket. [See the docs](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#update-ticket).",
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
    ticketCommentBody: {
      propDefinition: [
        app,
        "ticketCommentBody",
      ],
    },
    ticketPriority: {
      propDefinition: [
        app,
        "ticketPriority",
      ],
    },
    ticketSubject: {
      propDefinition: [
        app,
        "ticketSubject",
      ],
    },
    ticketStatus: {
      propDefinition: [
        app,
        "ticketStatus",
      ],
    },
  },
  methods: {
    updateTicket({
      ticketId, ...args
    } = {}) {
      return this.app.update({
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      ticketId,
      ticketCommentBody,
      ticketPriority,
      ticketSubject,
      ticketStatus,
    } = this;

    const response = await this.updateTicket({
      step,
      ticketId,
      data: {
        ticket: {
          comment: {
            body: ticketCommentBody,
          },
          priority: ticketPriority,
          subject: ticketSubject,
          status: ticketStatus,
        },
      },
    });

    step.export("$summary", `Successfully updated ticket with ID ${response.ticket.id}`);

    return response;
  },
};

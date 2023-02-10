import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-create-ticket",
  name: "Create Ticket",
  description: "Creates a ticket. [See the docs](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#create-ticket).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
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
    createTicket(args = {}) {
      return this.app.create({
        path: "/tickets",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      ticketCommentBody,
      ticketPriority,
      ticketSubject,
      ticketStatus,
    } = this;

    const response = await this.createTicket({
      step,
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

    step.export("$summary", `Successfully created ticket with ID ${response.ticket.id}`);

    return response;
  },
};

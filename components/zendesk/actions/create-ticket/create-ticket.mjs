import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-create-ticket",
  name: "Create Ticket",
  description: "Creates a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#create-ticket).",
  type: "action",
  version: "0.1.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
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
      customSubdomain,
    } = this;

    const response = await this.createTicket({
      step,
      customSubdomain,
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

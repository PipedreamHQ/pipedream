import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-update-ticket",
  name: "Update Ticket",
  description: "Updates a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#update-ticket).",
  type: "action",
  version: "0.2.0",
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
    tags: {
      propDefinition: [
        app,
        "tags",
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
      tags,
      customSubdomain,
    } = this;

    const ticket = {
      ...(ticketCommentBody && {
        comment: {
          body: ticketCommentBody,
        },
      }),
      ...(ticketPriority && {
        priority: ticketPriority,
      }),
      ...(ticketSubject && {
        subject: ticketSubject,
      }),
      ...(ticketStatus && {
        status: ticketStatus,
      }),
      ...(tags !== undefined && {
        tags,
      }),
    };

    const response = await this.updateTicket({
      step,
      ticketId,
      customSubdomain,
      data: {
        ticket,
      },
    });

    step.export("$summary", `Successfully updated ticket with ID ${response.ticket.id}`);

    return response;
  },
};

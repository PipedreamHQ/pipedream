import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-update-ticket",
  name: "Update Ticket",
  description: "Updates a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#update-ticket).",
  type: "action",
  version: "0.1.3",
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
    ticketCommentBodyIsHTML: {
      propDefinition: [
        app,
        "ticketCommentBodyIsHTML",
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
    ticketCommentPublic: {
      propDefinition: [
        app,
        "ticketCommentPublic",
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
      ticketCommentBodyIsHTML,
      ticketPriority,
      ticketSubject,
      ticketStatus,
      ticketCommentPublic,
      customSubdomain,
    } = this;

    const ticketComment = ticketCommentBodyIsHTML
      ? {
        html_body: ticketCommentBody,
      }
      : {
        body: ticketCommentBody,
      };

    ticketComment.public = ticketCommentPublic;

    const response = await this.updateTicket({
      step,
      ticketId,
      customSubdomain,
      data: {
        ticket: {
          comment: ticketComment,
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

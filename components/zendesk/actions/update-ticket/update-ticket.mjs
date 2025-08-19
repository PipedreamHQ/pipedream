import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-update-ticket",
  name: "Update Ticket",
  description: "Updates a ticket with optional file attachments. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#update-ticket).",
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
    attachments: {
      propDefinition: [
        app,
        "attachments",
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
      attachments,
    } = this;

    const ticketComment = ticketCommentBodyIsHTML
      ? {
        html_body: ticketCommentBody,
      }
      : {
        body: ticketCommentBody,
      };

    ticketComment.public = ticketCommentPublic;

    // Upload attachments if provided
    if (attachments && attachments.length > 0) {
      try {
        const uploadTokens = await this.app.uploadFiles({
          attachments,
          customSubdomain,
          step,
        });
        
        if (uploadTokens.length > 0) {
          ticketComment.uploads = uploadTokens;
        }
      } catch (error) {
        step.export("$summary", `Failed to upload attachments: ${error.message}`);
        throw error;
      }
    }

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

    const attachmentCount = attachments?.length || 0;
    const summary = attachmentCount > 0 
      ? `Successfully updated ticket with ID ${response.ticket.id} with ${attachmentCount} attachment(s)`
      : `Successfully updated ticket with ID ${response.ticket.id}`;
    
    step.export("$summary", summary);

    return response;
  },
};

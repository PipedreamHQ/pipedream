import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-update-ticket",
  name: "Update Ticket",
  description: "Updates a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#update-ticket).",
  type: "action",
  version: "0.2.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    ticketTags: {
      propDefinition: [
        app,
        "ticketTags",
      ],
    },
    tagAction: {
      type: "string",
      label: "Tag Action",
      description: "How to handle the tags: set (replace all existing tags), add (append to existing tags), or remove (remove specified tags)",
      options: [
        {
          label: "Set Tags (Replace All)",
          value: "set",
        },
        {
          label: "Add Tags (Append)",
          value: "add",
        },
        {
          label: "Remove Tags",
          value: "remove",
        },
      ],
      optional: true,
      default: "set",
    },
    assigneeId: {
      propDefinition: [
        app,
        "assigneeId",
      ],
    },
    assigneeEmail: {
      propDefinition: [
        app,
        "assigneeEmail",
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
      ticketTags,
      tagAction,
      assigneeId,
      assigneeEmail,
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

    // Build ticket data object
    const ticketData = {
      comment: ticketComment,
      priority: ticketPriority,
      subject: ticketSubject,
      status: ticketStatus,
    };

    // Add assignee fields if provided
    if (assigneeId) {
      ticketData.assignee_id = assigneeId;
    }
    if (assigneeEmail) {
      ticketData.assignee_email = assigneeEmail;
    }

    const response = await this.updateTicket({
      step,
      ticketId,
      customSubdomain,
      data: {
        ticket: ticketData,
      },
    });

    const attachmentCount = ticketComment.uploads?.length || 0;
    const assigneeUpdated = assigneeId || assigneeEmail;

    let summary = `Successfully updated ticket with ID ${response.ticket.id}`;

    const updates = [];
    if (attachmentCount > 0) {
      updates.push(`${attachmentCount} attachment(s)`);
    }
    if (assigneeUpdated) {
      updates.push("assignee");
    }

    if (updates.length > 0) {
      summary += ` with ${updates.join(" and ")}`;
    }

    step.export("$summary", summary);

    // Handle tag operations if tags are provided
    if (ticketTags && ticketTags.length > 0) {
      let tagResponse;

      switch (tagAction) {
      case "add":
        tagResponse = await this.app.addTicketTags({
          step,
          ticketId,
          tags: ticketTags,
          customSubdomain,
        });
        break;
      case "remove":
        tagResponse = await this.app.removeTicketTags({
          step,
          ticketId,
          tags: ticketTags,
          customSubdomain,
        });
        break;
      case "set":
      default:
        tagResponse = await this.app.setTicketTags({
          step,
          ticketId,
          tags: ticketTags,
          customSubdomain,
        });
        break;
      }

      // Include tag information in summary
      const tagSummary = `and ${tagAction === "set"
        ? "set"
        : tagAction === "add"
          ? "added"
          : "removed"} ${ticketTags.length} tag(s)`;
      step.export("$summary", `Successfully updated ticket with ID ${response.ticket.id} ${tagSummary}`);
      // Include tag response in the return data
      return {
        ticket: response,
        tags: tagResponse,
      };
    }

    step.export("$summary", `Successfully updated ticket with ID ${response.ticket.id}`);
    return response;
  },
};


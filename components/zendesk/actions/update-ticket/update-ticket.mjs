import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-update-ticket",
  name: "Update Ticket",
  description: "Updates a ticket and optionally manages tags. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#update-ticket).",
  type: "action",
  version: "0.1.4",
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
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
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
      customSubdomain,
      ticketTags,
      tagAction,
    } = this;

    const response = await this.updateTicket({
      step,
      ticketId,
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


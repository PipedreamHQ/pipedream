import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-ticket-comments",
  name: "List Ticket Comments",
  description: "Retrieves all comments for a specific ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/ticket_comments/#list-comments).",
  version: "0.0.3",
  type: "action",
  props: {
    zendesk,
    ticketId: {
      propDefinition: [
        zendesk,
        "ticketId",
      ],
    },
    sortOrder: {
      propDefinition: [
        zendesk,
        "sortOrder",
      ],
    },
    limit: {
      propDefinition: [
        zendesk,
        "limit",
      ],
      description: "Maximum number of comments to return",
    },
  },
  async run({ $: step }) {
    const results = this.zendesk.paginate({
      fn: this.zendesk.listTicketComments,
      args: {
        step,
        ticketId: this.ticketId,
        params: {
          sort_order: this.sortOrder,
        },
      },
      resourceKey: "comments",
      max: this.limit,
    });

    const comments = [];
    for await (const comment of results) {
      comments.push(comment);
    }

    step.export("$summary", `Successfully retrieved ${comments.length} comment${comments.length === 1
      ? ""
      : "s"}`);

    return comments;
  },
};

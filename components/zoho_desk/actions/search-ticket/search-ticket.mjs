import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-search-ticket",
  name: "Search Ticket",
  description: "Searches for tickets in your help desk. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Search_TicketsSearchAPI)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search throughout the ticket with `wildcard search` strategy",
      optional: true,
    },
    departmentId: {
      propDefinition: [
        zohoDesk,
        "departmentId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        zohoDesk,
        "ticketStatus",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        zohoDesk,
        "ticketPriority",
      ],
    },
    assigneeId: {
      propDefinition: [
        zohoDesk,
        "assigneeId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    channel: {
      propDefinition: [
        zohoDesk,
        "channel",
      ],
    },
    sortBy: {
      propDefinition: [
        zohoDesk,
        "ticketSortBy",
      ],
    },
    from: {
      propDefinition: [
        zohoDesk,
        "from",
      ],
    },
    limit: {
      propDefinition: [
        zohoDesk,
        "limit",
      ],
    },
    maxResults: {
      propDefinition: [
        zohoDesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      search,
      departmentId,
      status,
      priority,
      assigneeId,
      channel,
      sortBy,
      from,
      limit,
      maxResults,
    } = this;

    const params = {
      _all: search,
      sortBy: sortBy || "relevance",
    };

    // Add optional filter parameters
    if (departmentId) params.departmentId = departmentId;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (assigneeId) params.assignee = assigneeId;
    if (channel) params.channel = channel;
    if (from) params.from = from;
    if (limit) params.limit = limit;

    const tickets = [];
    const stream = this.zohoDesk.searchTicketsStream({
      headers: {
        orgId,
      },
      params,
      max: maxResults,
    });

    for await (const ticket of stream) {
      tickets.push(ticket);
    }

    $.export("$summary", `Successfully found ${tickets.length} ticket(s)`);

    return tickets;
  },
};

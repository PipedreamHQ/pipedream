import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-tickets",
  name: "List Tickets",
  description: "Lists all tickets in your help desk with optional filtering. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Listalltickets)",
  type: "action",
  version: "0.0.1",
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
    departmentId: {
      propDefinition: [
        zohoDesk,
        "departmentId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    status: {
      propDefinition: [
        zohoDesk,
        "ticketStatus",
      ],
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
    contactId: {
      propDefinition: [
        zohoDesk,
        "contactId",
        ({ orgId }) => ({
          orgId,
        }),
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
    include: {
      type: "string",
      label: "Include",
      description: "Additional resources to include in the response (comma-separated). For example: `contacts,products,assignee`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      departmentId,
      status,
      priority,
      assigneeId,
      channel,
      contactId,
      sortBy,
      from,
      limit,
      maxResults,
      include,
    } = this;

    const params = {};

    // Add optional filter parameters
    if (departmentId) params.departmentId = departmentId;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (assigneeId) params.assignee = assigneeId;
    if (channel) params.channel = channel;
    if (contactId) params.contactId = contactId;
    if (sortBy) params.sortBy = sortBy;
    if (from) params.from = from;
    if (limit) params.limit = limit;
    if (include) params.include = include;

    const tickets = [];
    const stream = this.zohoDesk.getTicketsStream({
      headers: {
        orgId,
      },
      params,
      max: maxResults,
    });

    for await (const ticket of stream) {
      tickets.push(ticket);
    }

    $.export("$summary", `Successfully retrieved ${tickets.length} ticket(s)`);

    return tickets;
  },
};

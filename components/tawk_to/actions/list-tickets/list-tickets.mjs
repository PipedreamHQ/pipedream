import tawk_to from "../../tawk_to.app.mjs";

export default {
  key: "tawk_to-list-tickets",
  name: "List Tickets",
  description:
    "Retrieve tickets for a specific tawk.to property via `POST /ticket.list`. Optionally filter by status (`open`, `pending`, `closed`), date range, or sort order. Each ticket contains ticket ID, subject, requester/visitor info, message history, and status. Call **List Properties** first to discover valid `propertyId` values. [See the documentation](https://developer.tawk.to/).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tawk_to,
    propertyId: {
      propDefinition: [
        tawk_to,
        "propertyId",
      ],
      description:
        "The unique identifier of the property to retrieve tickets from. Run **List Properties** first to discover valid property IDs.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter tickets by status.",
      optional: true,
      options: [
        "open",
        "pending",
        "closed",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description:
        "Filter tickets created from this timestamp in ISO 8601 format (e.g. `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description:
        "Filter tickets created up to this timestamp in ISO 8601 format (e.g. `2026-01-31T23:59:59Z`).",
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size",
      description: "Number of tickets to return.",
      optional: true,
      min: 1,
    },
    deleted: {
      type: "boolean",
      label: "Deleted",
      description: "Whether to return deleted tickets.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order of the returned tickets.",
      optional: true,
      options: [
        {
          label: "Newest first (co-new-old)",
          value: "co-new-old",
        },
        {
          label: "Oldest first (co-old-new)",
          value: "co-old-new",
        },
      ],
    },
    dateType: {
      type: "string",
      label: "Date Type",
      description: "Filter date field type (e.g. `cso` for created date).",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      propertyId: this.propertyId,
      ...(this.status && {
        status: this.status,
      }),
      ...(this.startDate && {
        startDate: this.startDate,
      }),
      ...(this.endDate && {
        endDate: this.endDate,
      }),
      ...(this.size !== undefined && {
        size: this.size,
      }),
      ...(this.deleted !== undefined && {
        deleted: this.deleted,
      }),
      ...(this.sort && {
        sort: this.sort,
      }),
      ...(this.dateType && {
        dateType: this.dateType,
      }),
    };

    const response = await this.tawk_to.listTickets({
      $,
      data,
    });

    const tickets = response?.data || [];
    $.export("$summary", `Successfully retrieved ${tickets.length} ticket(s)`);
    return response;
  },
};

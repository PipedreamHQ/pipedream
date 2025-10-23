import ticketsauce from "../../ticketsauce.app.mjs";

export default {
  key: "ticketsauce-get-orders",
  name: "Get Orders",
  description: "Get a list of orders from the specified event. [See documentation](https://speca.io/ticketsauce/ticketsauce-public-api?key=204000d6bda66da78315e721920f43aa#orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ticketsauce,
    partnerId: {
      propDefinition: [
        ticketsauce,
        "partnerId",
      ],
    },
    organizationId: {
      propDefinition: [
        ticketsauce,
        "organizationId",
      ],
    },
    eventId: {
      propDefinition: [
        ticketsauce,
        "eventId",
        (c) => ({
          partnerId: c.partnerId,
          organizationId: c.organizationId,
        }),
      ],
    },
    perPage: {
      type: "string",
      label: "Per Page",
      description: "How many results to retrieve (per page). Max 500.",
      optional: true,
      default: "100",
    },
    page: {
      type: "string",
      label: "Page",
      description: "Which page to return. For example, if per_page is 20, and page is 3, the results would show 41-60.",
      optional: true,
      default: "1",
    },
    q: {
      type: "string",
      label: "Search Query",
      description: "Exact email address or last name attached to an order.",
      optional: true,
    },
    returnQuestionnaires: {
      type: "boolean",
      label: "Return Questionnaires",
      description: "Whether or not to return the question responses from questionnaires (will include attendee responses as well IF tickets are returned)",
      optional: true,
      default: false,
    },
    returnTickets: {
      type: "boolean",
      label: "Return Tickets",
      description: "Whether or not to return the tickets for each order as well.",
      optional: true,
      default: false,
    },
    returnLineItemFees: {
      type: "boolean",
      label: "Return Line Item Fees",
      description: "Whether or not to return the itemized line item fees for each order (if they exist).",
      optional: true,
      default: false,
    },
    orderedAfter: {
      type: "string",
      label: "Ordered After",
      description: "Only retrieve orders that were ordered AFTER the specified date/time (format`: YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`).",
      optional: true,
    },
    orderedBefore: {
      type: "string",
      label: "Ordered Before",
      description: "Only retrieve orders that were ordered BEFORE the specified date/time (format`: YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`).",
      optional: true,
    },
    modifiedAfter: {
      type: "string",
      label: "Modified After",
      description: "Only retrieve orders that were modified AFTER the specified date/time (format`: YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`).",
      optional: true,
    },
    modifiedBefore: {
      type: "string",
      label: "Modified Before",
      description: "Only retrieve orders that were modified BEFORE the specified date/time (format`: YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`).",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort orders by.",
      optional: true,
      default: "date",
      options: [
        {
          label: "Ordered date",
          value: "date",
        },
        {
          label: "Last name",
          value: "name",
        },
      ],
    },
    sortDir: {
      type: "string",
      label: "Sort Direction",
      description: "Direction to sort results.",
      optional: true,
      default: "asc",
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
    },
    totalAbove: {
      type: "string",
      label: "Total Above",
      description: "Return only orders whose order total is greater than this value.",
      optional: true,
    },
    totalBelow: {
      type: "string",
      label: "Total Below",
      description: "Return only orders whose order total is less than this value.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      per_page: this.perPage,
      page: this.page,
      q: this.q,
      return_questionnaires: String(this.returnQuestionnaires),
      return_tickets: String(this.returnTickets),
      return_line_item_fees: String(this.returnLineItemFees),
      ordered_after: this.orderedAfter,
      ordered_before: this.orderedBefore,
      modified_after: this.modifiedAfter,
      modified_before: this.modifiedBefore,
      sort_by: this.sortBy,
      sort_dir: this.sortDir,
      total_above: this.totalAbove,
      total_below: this.totalBelow,
    };

    return this.ticketsauce.listOrders($, {
      eventId: this.eventId,
      params,
    });
  },
};

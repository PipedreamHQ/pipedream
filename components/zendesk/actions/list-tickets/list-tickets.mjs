import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-tickets",
  name: "List Tickets",
  description: "Retrieves a list of tickets. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#list-tickets).",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    sortBy: {
      propDefinition: [
        app,
        "sortBy",
      ],
    },
    sortOrder: {
      propDefinition: [
        app,
        "sortOrder",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const {
      sortBy,
      sortOrder,
      limit,
      customSubdomain,
    } = this;

    const results = this.app.paginate({
      fn: this.app.listTickets,
      args: {
        step,
        customSubdomain,
        params: {
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      },
      resourceKey: "tickets",
      max: limit,
    });

    const tickets = [];
    for await (const ticket of results) {
      tickets.push(ticket);
    }

    step.export("$summary", `Successfully retrieved ${tickets.length} tickets`);

    return tickets;
  },
};

import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-tickets",
  name: "List Tickets",
  description: "Retrieves a list of tickets. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#list-tickets).",
  type: "action",
  version: "0.0.19",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk,
    sortBy: {
      propDefinition: [
        zendesk,
        "sortBy",
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
    },
    customSubdomain: {
      propDefinition: [
        zendesk,
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

    const results = this.zendesk.paginate({
      fn: this.zendesk.listTickets,
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

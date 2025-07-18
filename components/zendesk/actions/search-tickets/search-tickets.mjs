import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-search-tickets",
  name: "Search Tickets",
  description: "Searches for tickets using Zendesk's search API. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/search/#search-tickets).",
  type: "action",
  version: "0.0.3",
  props: {
    app,
    query: {
      type: "string",
      label: "Search Query",
      description: "The search query to find tickets. You can use Zendesk's search syntax. Example: `type:ticket status:open priority:high`. [See the documentation](https://developer.zendesk.com/documentation/ticketing/using-the-zendesk-api/searching-with-the-zendesk-api/)",
    },
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
      query,
      sortBy,
      sortOrder,
      limit,
      customSubdomain,
    } = this;

    const results = this.app.paginate({
      fn: this.app.searchTickets,
      args: {
        step,
        customSubdomain,
        params: {
          query,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      },
      resourceKey: "results",
      max: limit,
    });

    const tickets = [];
    for await (const ticket of results) {
      tickets.push(ticket);
    }

    step.export("$summary", `Successfully found ${tickets.length} tickets matching the search query`);

    return tickets;
  },
};

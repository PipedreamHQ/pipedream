import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-search-tickets",
  name: "Search Tickets",
  description: "Searches for tickets using Zendesk's search API. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/search/#search-tickets).",
  type: "action",
  version: "0.0.7",
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
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to retrieve. Default is 1.",
      default: 1,
      optional: true,
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

    const results = await this.app.searchTickets({
      step,
      customSubdomain,
      params: {
        query,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: limit,
        page: this.page,
      },
    });

    step.export("$summary", "Successfully retrieved tickets matching the search query");

    return results;
  },
};

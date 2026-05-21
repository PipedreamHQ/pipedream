import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-search-tickets",
  name: "Search Tickets",
  description: "Search tickets using Freshdesk's filter query syntax. [See the documentation](https://developers.freshdesk.com/api/#filter_tickets)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    query: {
      type: "string",
      label: "Query",
      description: "Freshdesk ticket filter query. For example, `status:2` or `priority:4 OR priority:3`.",
    },
    maxResults: {
      propDefinition: [
        freshdesk,
        "maxResults",
      ],
    },
  },
  methods: {
    formatQuery(query) {
      const trimmed = query.trim();
      return trimmed.startsWith("\"") && trimmed.endsWith("\"")
        ? trimmed
        : `"${trimmed}"`;
    },
  },
  async run({ $ }) {
    const results = [];
    const params = {
      query: this.formatQuery(this.query),
      page: 1,
    };

    for await (const ticket of this.freshdesk.filterTickets(params)) {
      results.push(ticket);
      if (this.maxResults && results.length >= this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully found ${results.length} ticket${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};

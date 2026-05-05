import { axios } from "@pipedream/platform";

export default {
  key: "zendesk-search-tickets",
  name: "Search Tickets",
  description: "Search for tikcets using Zendesk's search API. [See the docuentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/search/#search-tickets).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk: {
      type: "app",
      app: "zendesk",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query to find tickets. You can use Zendesk's search syntax. Example: `type:ticket status:open priority:high`. [See the documentation](https://developer.zendesk.com/documentation/ticketing/using-the-zendesk-api/searching-with-the-zendesk-api/)",
    },
  },
  methods: {
    searchTickets({
      $, ...args
    }) {
      return axios($, {
        baseURL: `https://${this.zendesk.$auth.subdomain}.zendesk.com`,
        url: "/api/v2/search",
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.zendesk.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.searchTickets({
      $,
      params: {
        query: this.query,
      },
    });
    return response;
  },
};

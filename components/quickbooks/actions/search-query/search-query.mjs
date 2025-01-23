import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-search-query",
  name: "Search Query",
  description: "Performs a search query against a Quickbooks entity. [See the documentation](https://developer.intuit.com/app/develophttps://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries)",
  version: "0.1.8",
  type: "action",
  props: {
    quickbooks,
    searchQuery: {
      label: "Search Query",
      type: "string",
      description: "A search query against a Quickbooks entity. See query language syntax, limitations, and other specifications on [Data queries](https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries)",
    },
  },
  async run({ $ }) {
    if (!this.searchQuery) {
      throw new ConfigurationError("Must provide searchQuery parameter.");
    }

    const response = await this.quickbooks.query({
      $,
      params: {
        query: this.searchQuery,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved query results");
    }
    return response;
  },
};

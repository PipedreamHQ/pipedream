import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-search-query",
  name: "Search Query",
  description: "Performs a search query against a Quickbooks entity. [See docs here](https://developer.intuit.com/app/develophttps://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries)",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    searchQuery: {
      label: "Search Query",
      type: "string",
      description: "A search query against a Quickbooks entity. See query language syntax, limitations, and other specifications on [Data queries](https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries)",
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.searchQuery) {
      throw new ConfigurationError("Must provide searchQuery parameter.");
    }

    const response = await this.quickbooks.query({
      $,
      params: {
        minorversion: this.minorversion,
        query: this.searchQuery,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved query results");
    }
  },
};

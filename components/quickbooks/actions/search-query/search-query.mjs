// legacy_hash_id: a_2wipEQ
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-search-query",
  name: "Search Query",
  description: "Performs a search query against a Quickbooks entity.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks: {
      type: "app",
      app: "quickbooks",
    },
    search_query: {
      type: "string",
      description: "A search query against a Quickbooks entity. See query language syntax, limitations, and other specifications on [Data queries](https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries)",
    },
    minorversion: {
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  //See Quickbooks API docs at: https://developer.intuit.com/app/develophttps://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries

    if (!this.search_query) {
      throw new Error("Must provide search_query parameter.");
    }

    //Sends the request against Quickbooks API
    return await axios($, {
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/query`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/octet-stream",
      },
      params: {
        minorversion: this.minorversion,
        query: this.search_query,
      },
    });
  },
};

// legacy_hash_id: a_vgid15
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks_sandbox-search-account",
  name: "Search Account",
  description: "Searches for accounts.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks_sandbox: {
      type: "app",
      app: "quickbooks_sandbox",
    },
    include_clause: {
      type: "string",
      description: "Fields to use in the include clause of the Account data query. See query language syntax, limitations, and other specifications on [Data queries](https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries)",
    },
    where_clause: {
      type: "string",
      description: "Filters to use in the where clause of the Account data query. Note: Multiple clauses (filters) are AND'd. The OR operation is not supported.",
    },
    order_clause: {
      type: "string",
      description: "The `order_clause` is for sorting the result. Include the Account property to sort by. The default sort order is ascending; to indicate descending sort order, include DESC, for example: `Name DESC`",
      optional: true,
    },
    start_position: {
      type: "string",
      description: "The starting count of the response for pagination.",
      optional: true,
    },
    max_results: {
      type: "string",
      description: "The number of Account entity elements in the response.",
      optional: true,
    },
    minorversion: {
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  //See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account#query-an-account

    if (!this.include_clause || !this.where_clause) {
      throw new Error("Must provide include_clause, where_clause parameters.");
    }

    //Prepares OrderBy clause,start position, max results parameters to be used in the request's query parameter.
    var orderClause = "";
    if (this.order_clause) {
      orderClause = ` ORDERBY  ${this.order_clause}`;
    }

    var startPosition = "";
    if (this.start_position) {
      startPosition = ` STARTPOSITION  ${this.start_position}`;
    }

    var maxResults = "";
    if (this.max_results) {
      maxResults = ` MAXRESULTS ${this.max_results}` || "";
    }

    //Prepares the request's query parameter
    const query = `select ${this.include_clause} from Account where ${this.where_clause}${orderClause}${startPosition}${maxResults}`;

    //Sends the request against Quickbooks API
    return await axios($, {
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.quickbooks_sandbox.$auth.company_id}/query`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks_sandbox.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/octet-stream",
      },
      params: {
        minorversion: this.minorversion,
        query,
      },
    });
  },
};

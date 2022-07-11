import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-search-time-activities",
  name: "Search Time Activities",
  description: "Searches for time activities. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/timeactivity#query-a-timeactivity-object)",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    includeClause: {
      description: "Fields to use in the select clause of the Bill data query. See query language syntax, limitations, and other specifications on [Data queries](https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries)",
      label: "Include Clause",
      type: "string",
    },
    maxResults: {
      description: "The number of Bill entity elements in the response.",
      label: "Max Results",
      optional: true,
      type: "string",
    },
    orderClause: {
      description: "The `orderClause` is for sorting the result. Include the Bill property to sort by. The default sort order is ascending; to indicate descending sort order, include DESC, for example: `Name DESC`",
      label: "Order Clause",
      optional: true,
      type: "string",
    },
    startPosition: {
      description: "The starting count of the response for pagination.",
      label: "Start Position",
      optional: true,
      type: "string",
    },
    whereClause: {
      description: "Filters to use in the where clause of the Bill data query. Note: Multiple clauses (filters) are AND'd. The OR operation is not supported.",
      label: "Where Clause",
      type: "string",
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.includeClause || !this.whereClause) {
      throw new ConfigurationError("Must provide includeClause, whereClause parameters.");
    }

    var orderClause = "";
    if (this.orderClause) {
      orderClause = ` ORDERBY  ${this.orderClause}`;
    }

    var startPosition = "";
    if (this.startPosition) {
      startPosition = ` STARTPOSITION  ${this.startPosition}`;
    }

    var maxResults = "";
    if (this.maxResults) {
      maxResults = ` MAXRESULTS ${this.maxResults}` || "";
    }

    //Prepares the request's query parameter
    const query = `select ${this.includeClause} from TimeActivity where ${this.whereClause}${orderClause}${startPosition}${maxResults}`;

    const response = await this.quickbooks.query({
      $,
      params: {
        minorversion: this.minorversion,
        query,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved activities");
    }

    return response;
  },
};

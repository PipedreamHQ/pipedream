import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-search-invoices",
  name: "Search Invoices",
  description: "Searches for invoices. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#query-an-invoice)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
    maxResults: {
      propDefinition: [
        quickbooks,
        "maxResults",
      ],
    },
    orderClause: {
      propDefinition: [
        quickbooks,
        "orderClause",
      ],
    },
    startPosition: {
      description: "The starting count of the response for pagination.",
      label: "Start Position",
      optional: true,
      type: "string",
    },
    whereClause: {
      propDefinition: [
        quickbooks,
        "whereClause",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    if (!this.whereClause) {
      throw new ConfigurationError("Must provide whereClause parameter.");
    }

    const orderClause = this.orderClause
      ? ` ORDERBY  ${this.orderClause}`
      : "";

    const startPosition = this.startPosition
      ? ` STARTPOSITION  ${this.startPosition}`
      : "";

    const maxResults = this.maxResults
      ? ` MAXRESULTS ${this.maxResults}`
      : "";

    const query = `select * from Invoice where ${this.whereClause}${orderClause}${startPosition}${maxResults}`;

    const response = await this.quickbooks.query({
      $,
      params: {
        query,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved invoices");
    }

    return response;
  },
};

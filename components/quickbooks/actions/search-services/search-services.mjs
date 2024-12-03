import quickbooks from "../../quickbooks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quickbooks-search-services",
  name: "Search Services",
  description: "Search for services. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#query-an-item)",
  version: "0.0.1",
  type: "action",
  props: {
    quickbooks,
    includeClause: {
      propDefinition: [
        quickbooks,
        "includeClause",
      ],
      optional: false,
    },
    whereClause: {
      propDefinition: [
        quickbooks,
        "whereClause",
      ],
      optional: false,
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
    maxResults: {
      propDefinition: [
        quickbooks,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    if (!this.include_clause || !this.where_clause) {
      throw new ConfigurationError("Must provide include_clause, where_clause parameters.");
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

    const query = `select ${this.include_clause} from Item where Type = 'Service' and ${this.where_clause}${orderClause}${startPosition}${maxResults}`;

    const response = await this.quickbooks.query({
      $,
      params: {
        query,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved services");
    }

    return response;
  },
};

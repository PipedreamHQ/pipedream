import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-search-products",
  name: "Search Products",
  description: "Search for products. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item#query-an-item)",
  version: "0.1.2",
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
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
      ],
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
    const query = `select ${this.includeClause} from Item where Type = 'Inventory' and ${this.whereClause}${orderClause}${startPosition}${maxResults}`;

    const response = await this.quickbooks.query({
      $,
      params: {
        minorversion: this.minorVersion,
        query,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved products");
    }

    return response;
  },
};

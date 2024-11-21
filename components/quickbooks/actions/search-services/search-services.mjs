import quickbooks from "../../quickbooks.app.mjs";

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
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
      ],
    },
  },
  async run({ $ }) {
    if (!this.include_clause || !this.where_clause) {
      throw new Error("Must provide include_clause, where_clause parameters.");
    }

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

    const query = `select ${this.include_clause} from Item where Type = 'Service' and ${this.where_clause}${orderClause}${startPosition}${maxResults}`;

    const response = await this.quickbooks.query({
      $,
      params: {
        minorversion: this.minorVersion,
        query,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved services");
    }

    return response;
  },
};

import app from "../../printavo.app.mjs";
import options from "../../common/options.mjs";

export default {
  name: "Search Customers",
  description: "Search customers. [See the docs here](https://printavo.docs.apiary.io/#reference/customers/customers-collection/customers-search)",
  key: "printavo-search-customers",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Query to search",
      optional: true,
    },
    sortColumn: {
      type: "string",
      label: "Sort Column",
      description: "Column to sort by. Default is `first_name`",
      options: options.SORT_COLUMN,
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Order to sort by. Default is `asc`",
      options: options.SORT_ORDER,
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return.",
      default: 100,
      min: 1,
      max: 10000,
    },
  },
  async run({ $ }) {
    const params = {
      query: this.query,
      sort_column: this.sortColumn,
      direction: this.sortOrder,
      page: 1,
    };

    let res = [];
    while (true) {
      const { data } = await this.app.searchCustomers(params);
      res = res.concat(data);
      if (data.length === 0 || res.length >= this.maxResults) {
        break;
      }
      params.page = params.page + 1;
    }

    $.export("$summary", `Successfully fetched ${res.length} register(s)`);
    return res;
  },
};

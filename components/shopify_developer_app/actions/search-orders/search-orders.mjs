import shopify from "../../shopify_developer_app.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "shopify_developer_app-search-orders",
  name: "Search for Orders",
  description: "Search for an order or a list of orders. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/orders)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
      optional: true,
    },
    sortKey: {
      type: "string",
      label: "Sort Key",
      description: "The key to sort the results by",
      optional: true,
      options: constants.ORDER_SORT_KEY,
    },
    max: {
      type: "integer",
      label: "Max Records",
      description: "Optionally limit the maximum number of records to return. Leave blank to retrieve all records.",
      optional: true,
    },
  },
  async run({ $ }) {
    const orders = await this.shopify.getPaginated({
      resourceFn: this.shopify.listOrders,
      resourceKeys: [
        "orders",
      ],
      variables: {
        query: this.query,
        sortKey: this.sortKey,
      },
      max: this.max,
    });
    $.export("$summary", `Found ${orders.length} order${orders.length === 1
      ? ""
      : "s"}`);
    return orders;
  },
};

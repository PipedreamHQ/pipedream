import shopify from "../../shopify.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "shopify-search-orders",
  name: "Search for Orders",
  description: "Search for an order or a list of orders. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/orders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has orders properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query. [See the documentation](https://shopify.dev/docs/api/usage/search-syntax)",
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

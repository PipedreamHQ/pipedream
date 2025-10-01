import shopify from "../../shopify_developer_app.app.mjs";

export default {
  key: "shopify_developer_app-search-fulfillment-orders",
  name: "Search for Fulfillment Orders",
  description: "Search for a fulfillment order or a list of fulfillment orders. [See the documentation](https://shopify.dev/docs/api/admin-graphql/unstable/queries/fulfillmentorders)",
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
    query: {
      type: "string",
      label: "Query",
      description: "A filter made up of terms, connectives, modifiers, and comparators. You can apply one or more filters to a query. Learn more about [Shopify API search syntax](https://shopify.dev/api/usage/search-syntax).",
      optional: true,
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
      resourceFn: this.shopify.listFulfillmentOrders,
      resourceKeys: [
        "fulfillmentOrders",
      ],
      variables: {
        query: this.query,
      },
      max: this.max,
    });
    $.export("$summary", `Found ${orders.length} fulfillment order${orders.length === 1
      ? ""
      : "s"}`);
    return orders;
  },
};

import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-fulfillment-orders",
  name: "Get Fulfillment Orders",
  description: "Retrieve a list of fulfillment orders. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/fulfillmentorders)",
  version: "0.0.6",
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
      content: "This query retrieves fulfillment orders filtered according to the fulfillment order access scopes granted to the app. Use this to retrieve fulfillment orders assigned to merchant-managed locations, third-party fulfillment service locations, or all kinds of locations together. Requires `read_assigned_fulfillment_orders`, `read_merchant_managed_fulfillment_orders`, `read_third_party_fulfillment_orders`, or `read_marketplace_fulfillment_orders` access scope. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/objects/fulfillmentorder#api-access-scopes)",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Filter fulfillment orders using [Shopify API search syntax](https://shopify.dev/api/usage/search-syntax). Available filters: `assigned_location_id` (id), `id` (id with range support like `id:>=1234`), `status` (string, e.g., `status:open`), `updated_at` (time), or default search (case-insensitive multi-field search). Examples: `status:open`, `assigned_location_id:12345`, `id:>=1000`, `updated_at:>2024-01-01`. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/fulfillmentorders#argument-fulfillmentorders-query)",
      optional: true,
    },
    includeClosed: {
      type: "boolean",
      label: "Include Closed",
      description: "Whether to include closed fulfillment orders in the results. Defaults to false.",
      optional: true,
      default: false,
    },
    sortKey: {
      propDefinition: [
        shopify,
        "sortKey",
      ],
      description: "The key to sort the results by. Options: `ID`",
    },
    maxResults: {
      propDefinition: [
        shopify,
        "maxResults",
      ],
    },
    reverse: {
      propDefinition: [
        shopify,
        "reverse",
      ],
    },
  },
  async run({ $ }) {
    const fulfillmentOrders = await this.shopify.getPaginated({
      resourceFn: this.shopify.listFulfillmentOrders,
      resourceKeys: [
        "fulfillmentOrders",
      ],
      variables: {
        query: this.query,
        sortKey: this.sortKey,
        reverse: this.reverse,
        includeClosed: this.includeClosed,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${fulfillmentOrders.length} fulfillment order${fulfillmentOrders.length === 1
      ? ""
      : "s"}`);
    return fulfillmentOrders;
  },
};

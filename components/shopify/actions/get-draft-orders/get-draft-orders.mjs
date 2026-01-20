import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-draft-orders",
  name: "Get Draft Orders",
  description: "Retrieve a list of draft orders. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/draftorders)",
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
      content: "Please verify that the Shopify shop has draft orders properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Filter draft orders using [Shopify API search syntax](https://shopify.dev/api/usage/search-syntax). Available filters: `created_at` (time), `customer_id` (id), `id` (id with range support like `id:>=1234`), `status` (string, e.g., `status:OPEN`), `tag` (string), `updated_at` (time), `source` (string), or default search (case-insensitive multi-field search). Examples: `status:OPEN`, `created_at:>2019-12-01`, `customer_id:544365967`, `tag:fraud`. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/draftorders#argument-draftorders-query)",
      optional: true,
    },
    sortKey: {
      propDefinition: [
        shopify,
        "sortKey",
      ],
      description: "The key to sort the results by. Options: `CREATED_AT`, `ID`, `NUMBER`, `STATUS`, `TOTAL_PRICE`, `UPDATED_AT`, `CUSTOMER_NAME`",
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
    const draftOrders = await this.shopify.getPaginated({
      resourceFn: this.shopify.listDraftOrders,
      resourceKeys: [
        "draftOrders",
      ],
      variables: {
        query: this.query,
        sortKey: this.sortKey,
        reverse: this.reverse,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${draftOrders.length} draft order${draftOrders.length === 1
      ? ""
      : "s"}`);
    return draftOrders;
  },
};

import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-customers",
  name: "Get Customers",
  description: "Retrieve a list of customers. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/customers)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    // This app is not approved to access the Customer object. See https://shopify.dev/docs/apps/launch/protected-customer-data for more details."
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has customer data properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query string to filter customers. Example: `email:customer@example.com` or `state:ENABLED`. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/customers#argument-customers-query)",
      optional: true,
    },
    sortKey: {
      propDefinition: [
        shopify,
        "sortKey",
      ],
      description: "The key to sort the results by. Options: `CREATED_AT`, `ID`, `NAME`, `ORDERS_COUNT`, `STATE`, `TOTAL_SPENT`, `UPDATED_AT`",
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
    const customers = await this.shopify.getPaginated({
      resourceFn: this.shopify.listCustomers,
      resourceKeys: [
        "customers",
      ],
      variables: {
        query: this.query,
        sortKey: this.sortKey,
        reverse: this.reverse,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${customers.length} customer${customers.length === 1
      ? ""
      : "s"}`);
    return customers;
  },
};

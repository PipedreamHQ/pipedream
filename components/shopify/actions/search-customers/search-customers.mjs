import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-customers",
  name: "Search for Customers",
  description:
    "Filter customers in Shopify by a specific attribute — preferred over **Get Customers** when you know what you're looking for."
    + " **Get Customers** lists all customers without filtering; use this tool instead when you have a specific email, name, phone, tag, or state to match."
    + " Requires a query in Shopify filter syntax. Examples: `email:alan@ingen.com`, `first_name:Ellie last_name:Sattler`, `tag:vip`, `state:ENABLED`, `phone:+15555551234`."
    + " Use **Get Customer** (with the `id` from results) if you need the full customer record."
    + " Returns an array of customer objects including `id`, `email`, `phone`, `firstName`, and `lastName`."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/customers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has customer data properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search query using Shopify filter syntax. Examples: `email:alan@ingen.com`, `first_name:Ellie last_name:Sattler`, `tag:vip`, `state:ENABLED`",
    },
    sortKey: {
      propDefinition: [
        shopify,
        "sortKey",
      ],
      description: "The key to sort results by. Options: `CREATED_AT`, `ID`, `NAME`, `ORDERS_COUNT`, `STATE`, `TOTAL_SPENT`, `UPDATED_AT`",
    },
    maxResults: {
      propDefinition: [
        shopify,
        "maxResults",
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
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${customers.length} customer${customers.length === 1
      ? ""
      : "s"}`);
    return customers;
  },
};

import shopify from "../../shopify_developer_app.app.mjs";

export default {
  key: "shopify_developer_app-search-customers",
  name: "Search for Customers",
  description: "Search for a customer or a list of customers. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/customers)",
  version: "0.0.10",
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
    },
    max: {
      type: "integer",
      label: "Max Records",
      description: "Optionally limit the maximum number of records to return. Leave blank to retrieve all records.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.getPaginated({
      resourceFn: this.shopify.listCustomers,
      resourceKeys: [
        "customers",
      ],
      variables: {
        query: this.query,
      },
      max: this.max,
    });
    $.export("$summary", `Found ${response.length} customer(s)`);
    return response;
  },
};

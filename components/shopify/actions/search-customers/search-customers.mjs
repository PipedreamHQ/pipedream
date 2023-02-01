import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-customers",
  name: "Search for Customers",
  description: "Search for a customer or a list of customers. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[get]/admin/api/2022-01/customers.json)",
  version: "0.0.4",
  type: "action",
  props: {
    shopify,
    query: {
      propDefinition: [
        shopify,
        "query",
      ],
    },
    max: {
      propDefinition: [
        shopify,
        "max",
      ],
    },
  },
  async run({ $ }) {
    let params = {
      query: this.query,
    };

    let response = await this.shopify.getPaginatedResults(
      this.shopify.searchCustomers,
      params,
      this.max,
    );
    $.export("$summary", `Found ${response.length} customer(s)`);
    return response;
  },
};

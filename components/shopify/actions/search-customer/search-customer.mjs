import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-customer",
  name: "Search Customer",
  description: "Search for a customer or a list of customers. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[get]/admin/api/2022-01/customers.json)",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    ids: {
      type: "string[]",
      propDefinition: [
        shopify,
        "customerId",
      ],
      label: "Customer IDs",
      description: "Restrict results to customers specified by a comma-separated list of IDs. Options will display the email registered with the ID. It is possible to select more than one option",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to show",
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Restrict results to those after the specified ID",
      optional: true,
    },
  },
  async run({ $ }) {
    let params = {
      ids: this.shopify.parseCommaSeparatedStrings(this.ids),
      limit: this.limit,
      since_id: this.sinceId,
    };

    let response = (await this.shopify.getCustomers(null, null, params)).results;
    $.export("$summary", `Found ${response.length} customer(s)`);
    return response;
  },
};

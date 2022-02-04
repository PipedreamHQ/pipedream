import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-customer",
  name: "Search Customer",
  description: "Search for a customer or a list of customers. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[get]/admin/api/2022-01/customers.json)",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
      ],
      label: "Customer",
      description: "Searches for customers that match a supplied query. For example, you can type in the name or email of the customer. See [Customer Query](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[get]/admin/api/2022-01/customers/search.json?query=Bob%20country:United%20States)",
      optional: true,
      reloadProps: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Restrict results to those after the specified ID",
      optional: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (!this.customerId) {
      props.limit = {
        type: "integer",
        label: "Limit",
        description: "The maximum number of results to show",
        default: 50,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    let params = {
      ids: this.customerId,
      limit: this.limit,
      since_id: this.sinceId,
    };

    let response = (await this.shopify.getCustomers(null, null, params)).result;
    $.export("$summary", `Found ${response.length} customer(s)`);
    return response;
  },
};

import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-search-customers",
  name: "Search for Customers",
  description: "Search for a customer or a list of customers. [See the documentation](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[get]/admin/api/2022-01/customers.json)",
  version: "0.0.11",
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
    ...common.props,
  },
};

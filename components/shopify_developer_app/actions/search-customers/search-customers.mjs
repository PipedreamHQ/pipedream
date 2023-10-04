import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/actions/search-customers/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-search-customers",
  name: "Search for Customers",
  description: "Search for a customer or a list of customers. [See the documentation](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[get]/admin/api/2022-01/customers.json)",
  version: "0.0.2",
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

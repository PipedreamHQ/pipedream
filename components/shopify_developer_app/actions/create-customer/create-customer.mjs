import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/create-customer/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the documentation](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[post]/admin/api/2022-01/customers.json)",
  version: "0.0.4",
  type: "action",
  props: {
    shopify,
    firstName: {
      propDefinition: [
        shopify,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        shopify,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        shopify,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        shopify,
        "phone",
      ],
    },
    address: {
      propDefinition: [
        shopify,
        "address",
      ],
    },
    company: {
      propDefinition: [
        shopify,
        "company",
      ],
    },
    city: {
      propDefinition: [
        shopify,
        "city",
      ],
    },
    province: {
      propDefinition: [
        shopify,
        "province",
      ],
    },
    country: {
      propDefinition: [
        shopify,
        "country",
      ],
    },
    zip: {
      propDefinition: [
        shopify,
        "zip",
      ],
    },
    ...common.props,
  },
};

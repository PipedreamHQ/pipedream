import shopify from "../../shopify_developer_app.app.mjs";

export default {
  key: "shopify_developer_app-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customercreate)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  },
  async run({ $ }) {
    const response = await this.shopify.createCustomer({
      input: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        addresses: [
          {
            address1: this.address,
            company: this.company,
            city: this.city,
            province: this.province,
            country: this.country,
            zip: this.zip,
          },
        ],
      },
    });
    if (response.customerCreate.userErrors.length > 0) {
      throw new Error(response.customerCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new customer with ID \`${response.customerCreate.customer.id}\``);
    return response;
  },
};
